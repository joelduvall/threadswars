namespace ThreadWars.Models
{
  public interface IUser
  {
    public string username { get; set; }
    public string externalId { get; set; }
    public string email { get; set; }
    public string firstName { get; set; }
    public string lastName { get; set; }
    public string authProvider { get; set; }
    public string avatar { get; set; }
    public bool isVerified { get; set; }  
  }
}