import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./BackgroundChanger.css";
import { BackgroundContext } from "../../../../context/BackgroundContext";

function BackgroundChanger() {
  const { backgrounds, setBackgrounds } = useContext(BackgroundContext); // Loading default images
  const [selectedImage, setSelectedImage] = useState(""); // State the selected background type
  const [imageFile, setImageFile] = useState(null); // State the image file
  const [originalExtension, setOriginalExtension] = useState(""); // State variable for original extension
  const [message, setMessage] = useState(""); // State variable for the message
  const [initialImage, setInitialImage] = useState(null); // State variable for the initial image

  const cropperRef = useRef(null);

  const handleSelectChange = (e) => {
    setMessage("");
    const selectedValue = e.target.value;
    setSelectedImage(selectedValue);

    if (selectedValue && backgrounds[selectedValue]) {
      setImageFile(backgrounds[selectedValue]);
      setInitialImage(backgrounds[selectedValue]); // Store the initial image
    } else {
      setImageFile(null); // Clear the image file if no valid selection
      setInitialImage(null); // Clear the initial image
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const extension = file.name.split(".").pop(); // Extract the original file extension
      setOriginalExtension(extension);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage("");
    }
  };

  const updateOrPostBackground = async (backgroundType, newImageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", newImageFile);
      formData.append("backgroundType", backgroundType);

      const response = await axios.post(
        "/api/backgroundimage/uploadBackground",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.newImagePath) {
        const isUpdated = response.data.updated
          ? "Background updated successfully"
          : "Background posted successfully";
        setMessage(isUpdated); // Set the message state

        const updatedImagePath = `${
          response.data.newImagePath
        }`;

        setBackgrounds((prevBackgrounds) => ({
          ...prevBackgrounds,
          [backgroundType]: updatedImagePath,
        }));
      } else {
        console.error("Failed to update background.\nCheck your connection.");
        setMessage("Failed to update background.\nCheck your connection."); // Set the failure message
      }
    } catch (error) {
      console.error(
        "Error.\nServer is not responding:",
        error
      );
      setMessage("Error updating background.\nServer is not responding"); // Set the error message
    }
  };

  const handleUpload = () => {
    if (selectedImage && cropperRef.current && cropperRef.current.cropper) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      const mimeType = `image/${
        originalExtension === "jpg" ? "jpeg" : originalExtension
      }`; // Determine MIME type

      canvas.toBlob((blob) => {
        const newFileName = `${selectedImage}.${originalExtension}`; // Use the original extension
        const blobWithExtension = new File([blob], newFileName, {
          type: mimeType,
        });
        updateOrPostBackground(selectedImage, blobWithExtension);
      }, mimeType); // Specify the original MIME type
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="maint-text text">
          <h1>Change background pictures</h1>
        </div>
        <div className="bgd-change-cont">
          <select className="bgd-select" onChange={handleSelectChange}>
            <option value="">Choose a background</option>
            <option value="background1">Home page main</option>
            <option value="background2">Office page main</option>
            <option value="background3">Meeting room main</option>
            <option value="background4">Meeting room secondary</option>
            <option value="background5">Butik page main</option>
          </select>
          <div className="bgd-sub">
            {imageFile && (
              <>
                <h2>Preview:</h2>
                <div className="bg-preview">
                  <Cropper
                    className="cropper"
                    src={imageFile}
                    style={{ height: "100%", width: "90%" }}
                    aspectRatio={16 / 9}
                    guides={true}
                    ref={cropperRef}
                    viewMode={1}
                    cropBoxResizable={false}
                    dragMode="move"
                  />
                  <div className="bgd-btns">
                    <input type="file" accept="image/*" id="fileInput" onChange={handleImageChange} />
                    <label className={`file-label ${!selectedImage ? "disabled" : ""}`} htmlFor="fileInput">Search</label>
                      <button className="bgd-change-btn" onClick={handleUpload} 
                        disabled={!selectedImage || !imageFile || imageFile === initialImage}>Upload</button>
                  </div>
                </div>
              </>
            )}
            {/* Display the message */}
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default BackgroundChanger;
