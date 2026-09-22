namespace backend.Models;

public class PollOption
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int Votes { get; set; } = 0;
}