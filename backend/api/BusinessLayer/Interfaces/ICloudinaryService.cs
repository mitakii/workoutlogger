using BusinessLayer.Exceptions;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace BusinessLayer.Interfaces;

public interface ICloudinaryService
{
    public Task<Result<ImageUploadResult>> AddPhotoAsync(IFormFile photo);
    public Task<Result<DeletionResult>> DeletePhotoAsync(string photoId);
}