using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace BusinessLayer.Services;

public class CloudinaryService : ICloudinaryService
{
    
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<Result<ImageUploadResult>> AddPhotoAsync(IFormFile photo)
    {
        var uploadResult = new ImageUploadResult();

        if (photo.Length > 0)
        {
            await using var stream = photo.OpenReadStream();

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(photo.FileName, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder = "profile-pictures",
            };
            
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }
        else 
            return Result<ImageUploadResult>.Failed(ErrorCode.BadRequest, "Image is empty");

        return uploadResult.Error != null ? 
            Result<ImageUploadResult>.Failed(ErrorCode.InternalError, uploadResult.Error.Message) : 
            Result<ImageUploadResult>.Success(uploadResult);
    }

    public async Task<Result<DeletionResult>> DeletePhotoAsync(string photoId)
    {
        var deleteParams = new DeletionParams(photoId);
        var result =  await _cloudinary.DestroyAsync(deleteParams);
        return Result<DeletionResult>.Success(result);
    }
}