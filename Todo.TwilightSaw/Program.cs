using Todo.TwilightSaw.Endpoints;
using Todo.TwilightSaw.Factory;

var app = HostFactory.CreateWebApplication(args);

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

TodoEndpoints.MapTodoEndpoints(app);

app.Run();

