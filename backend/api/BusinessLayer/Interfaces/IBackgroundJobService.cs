using System.Linq.Expressions;

namespace BusinessLayer.Interfaces;

public interface IBackgroundJobService
{
    void Enqueue<T>(Expression<Action<T>> method);
}