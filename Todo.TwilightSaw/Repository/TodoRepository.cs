using Microsoft.EntityFrameworkCore;

namespace Todo.TwilightSaw.Repository;

public class TodoRepository<T>(DbContext context) : IRepository<T> where T : class
{
    private readonly DbSet<T> _dbSet = context.Set<T>();

    public T GetById(int id)
    {
        return _dbSet.Find(id);
    }

    public IEnumerable<T> GetAll()
    {
        return _dbSet.ToList();
    }

    public void Add(T entity)
    {
        _dbSet.Add(entity);
        context.SaveChanges();
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
        context.SaveChanges();
    }

    public void Delete(int id)
    {
        var entity = _dbSet.Find(id);
        if (entity == null) return;
        _dbSet.Remove(entity);
        context.SaveChanges();
    }
}