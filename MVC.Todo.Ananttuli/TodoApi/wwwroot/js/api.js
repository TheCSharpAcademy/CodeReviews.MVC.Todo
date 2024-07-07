const uri = "/todos";

export class Api {
  static async postTodo(body) {
    try {
      const response = await fetch(`${uri}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }

  static async fetchAll() {
    const response = await fetch(uri);
    const data = await response.json();
    return data;
  }

  static async updateTodo(id, body) {
    try {
      const response = await fetch(`${uri}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  }

  static async deleteTodo(id) {
    try {
      await fetch(`${uri}/${id}`, {
        method: "DELETE",
      });

      return true;
    } catch {
      return false;
    }
  }
}
