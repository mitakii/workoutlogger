namespace BusinessLayer.Helpers;

public static class WorkoutDate
{
    public static DateOnly GetNormalizedDate(DateTime date)
    {
        return DateOnly.FromDateTime(date);
    }

    public static bool IsSameDate(DateOnly date1, DateOnly date2)
    {
        return date1 == date2;
    }
}