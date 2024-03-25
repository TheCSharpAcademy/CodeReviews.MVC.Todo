using Microsoft.AspNetCore.Mvc.Rendering;

namespace TodoListAPI.Models;

public class Status
{
    public static readonly List<SelectListItem> ValidStatus = new(
    [
    new() {Text = "Completed", Value = "Completed"},
    new() {Text = "In Progress", Value = "In Progress"},
    new() {Text = "On Hold", Value = "On Hold"},
    new() {Text = "Delayed", Value = "Delayed"},]);
}