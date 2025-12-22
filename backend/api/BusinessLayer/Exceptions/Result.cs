using ApplicationLayer.Data.Enums;

namespace BusinessLayer.Exceptions;

public class Result<T>
{
    public ICollection<string>? ErrorMessage { get; }
    public ErrorCode Code { get; }
    public bool Succeeded { get;  }
    public T? Data { get; }
    
    private Result(T data)
    {
        Succeeded = true;
        Data = data;
        ErrorMessage = null;
    }
    
    private Result(ErrorCode errorCode, ICollection<string> errors)
    {
        Code = errorCode;
        Succeeded = false;
        Data = default(T);
        ErrorMessage = errors;
    }

    public static Result<T> Success(T data) => new Result<T>(data);

    public static Result<T> Failed(ErrorCode code, ICollection<string> errors) => new Result<T>(code, errors);
    public static Result<T> Failed(ErrorCode code, string error) => new Result<T>(code, [error]);

}