using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Todo.WillowBear.Models;

namespace Todo.WillowBear.Data
{
    public class TodoItemConfiguration : IEntityTypeConfiguration<TodoItem>
    {
        public void Configure(EntityTypeBuilder<TodoItem> builder)
        {
            builder.ToTable("TodoItems");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title).IsRequired().HasMaxLength(20);
            builder.Property(x => x.IsDone).IsRequired().HasDefaultValue(0);
            builder.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("datetime('now')");
            builder.Property(x => x.DueDate);
        }
    }
}