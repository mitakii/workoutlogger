using ApplicationLayer.Data.Enums;

namespace BusinessLayer.Exceptions;

public class Result<T>
{
    // field / error message 
    public IDictionary<string, string>? ErrorMessages { get; } 
    public ErrorCode Code { get; }
    public bool Succeeded => Data != null;
    public T? Data { get; }
    
    private Result(T data)
    {
        Data = data;
        ErrorMessages = new Dictionary<string, string>();
    }
    
    private Result(ErrorCode errorCode, IDictionary<string, string> errors)
    {
        Code = errorCode;
        Data = default(T);
        ErrorMessages = errors;
    }

    public static Result<T> Success(T data) => new Result<T>(data);
    
    public static Result<T> Failed(ErrorCode code, IDictionary<string,string> errors) => new Result<T>(code, errors);
    public static Result<T> Failed(ErrorCode code, string error) =>
        new Result<T>(code, new Dictionary<string, string>() { [error] = "" });

}