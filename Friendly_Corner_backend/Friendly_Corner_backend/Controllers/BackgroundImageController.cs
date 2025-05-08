using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class BackgroundImageController : ControllerBase
{
    private readonly AppDbContext _context;

    public BackgroundImageController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("uploadBackground")]
    public async Task<IActionResult> UploadBackground(IFormFile image, [FromForm] string backgroundType)
    {
        if (string.IsNullOrEmpty(backgroundType))
        {
            return BadRequest(new { error = "backgroundType is required" });
        }

        if (image == null || image.Length == 0)
        {
            return BadRequest("No image uploaded.");
        }

        // Define folder path for storing images in wwwroot/img-bgd
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img-bgd");
        Directory.CreateDirectory(folderPath); // Ensure directory exists

        // Create a consistent filename based on background type
        var extension = Path.GetExtension(image.FileName); // Get the file extension
        var fileName = $"{backgroundType}{extension}"; // Create a new file name with the original extension
        var filePath = Path.Combine(folderPath, fileName);

        // Check if the background type already exists in the database
        var existingBackground = await _context.BackgroundImages
            .FirstOrDefaultAsync(img => img.BackgroundType == backgroundType);

        if (existingBackground != null)
        {
            // Get the full path of the existing file from the database
            var existingFilePath = Path.Combine(folderPath, Path.GetFileName(existingBackground.ImagePath)?? string.Empty);

            // Check if the old file exists and delete it
            if (System.IO.File.Exists(existingFilePath))
            {
                try
                {
                    System.IO.File.Delete(existingFilePath);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Error deleting old file: " + ex.Message);
                }
            }

            // Replace the existing file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Update the existing database entry
            existingBackground.ImagePath = $"/img-bgd/{fileName}";
            existingBackground.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(new { newImagePath = existingBackground.ImagePath, updated = true });
        }
        else
        {
            // Save the new image file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Save the details in the database
            var backgroundImage = new BackgroundImage
            {
                BackgroundType = backgroundType,
                ImagePath = $"/img-bgd/{fileName}", // Save relative path to database
                UpdatedAt = DateTime.Now
            };

            _context.BackgroundImages.Add(backgroundImage);
            await _context.SaveChangesAsync();
            return Ok(new { newImagePath = $"/img-bgd/{fileName}", updated = false });
        }
    }

    [HttpGet("getSavedImages")]
    public IActionResult GetSavedImages()
    {
        try
        {
            var images = _context.BackgroundImages.Select(img => new { img.BackgroundType, img.ImagePath }).ToList();
            if (!images.Any()) return NotFound("No images found.");
            return Ok(images);
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("checkExists")]
    public IActionResult CheckIfExists([FromQuery] string path)
    {
        // Check if the image exists
        string fullImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", path.TrimStart('/'));
        bool exists = System.IO.File.Exists(fullImagePath);
        return Ok(new { exists });
    }

    [HttpPost("updateBackground")]
    public async Task<IActionResult> UpdateBackground([FromBody] BackgroundUpdateModel model)
    {
        // Check if the image exists
        string fullImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", model.ImagePath.TrimStart('/'));
        if (System.IO.File.Exists(fullImagePath))
        {
            // Update the database with the new image path
            var backgroundImage = await _context.BackgroundImages
                .FirstOrDefaultAsync(img => img.BackgroundType == model.BackgroundType);

            if (backgroundImage != null)
            {
                backgroundImage.ImagePath = model.ImagePath;
                backgroundImage.UpdatedAt = DateTime.Now;
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            else
            {
                return NotFound(new { success = false, message = "Background type not found" });
            }
        }
        else
        {
            return NotFound(new { success = false, message = "Image not found" });
        }
    }

    public class BackgroundUpdateModel
    {
        public required string BackgroundType { get; set; }
        public required string ImagePath { get; set; }
    }
}
