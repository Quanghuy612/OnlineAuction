using System.Globalization;

namespace OnlineAuction_BE.Common
{
    public class HandleDatetime
    {
        public static DateTime ConverDateTime(DateTime? date)
        {

            // Convert to UTC first (if you need to handle time zones)
            var utcDate = date.Value.ToUniversalTime();

            // Return the DateTime value directly (SQL-compatible)
            return utcDate;
        }
    }
}
