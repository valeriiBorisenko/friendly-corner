using System;
using Friendly_Corner_backend.Extensions;

namespace Friendly_Corner_backend.Extensions
{
    public static class DateTimeExtensions
    {
        public static double ToTimestamp(this DateTime dateTime)
        {
            DateTime unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return (dateTime.ToUniversalTime() - unixEpoch).TotalSeconds;
        }
    }
} 