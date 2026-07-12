using System.Linq.Expressions;
using BusinessLayer.Interfaces;
using Hangfire;

namespace BusinessLayer.Services;

public class HangfireJobService : IBackgroundJobService
{
    public void Enqueue<T>(Expression<Action<T>> method)
    {
        BackgroundJob.Enqueue<T>(method);
    }
}