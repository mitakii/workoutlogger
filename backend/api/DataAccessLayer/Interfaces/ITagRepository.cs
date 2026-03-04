using DataAccessLayer.Entities;

namespace DataAccessLayer.Interfaces;

public interface ITagRepository
{
    public ICollection<Tag> GetTags(string query);
    public ICollection<Tag> GetTags(Guid exerciseId);
    public ICollection<Tag> NormalizeDbTags(ICollection<Tag> tags);
    public Tag AddTag(Tag tag);
    public Tag DeleteTag(Tag tag);
}