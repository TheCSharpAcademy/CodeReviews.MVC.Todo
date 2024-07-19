export class Ui {
  static createTableSectionHeaderRows(numIncomplete, numCompleted) {
    const incompleteMarkerRow = Ui.fromHTML(`
      <tr class="incomplete-marker-row">
        <td colspan="4">Incomplete (${numIncomplete})</td>
      </tr>
    `);

    const completedMarkerRow = Ui.fromHTML(`
      <tr class="completed-marker-row">
        <td colspan="4">Completed (${numCompleted})</td>
      </tr>
    `);

    return { incompleteMarkerRow, completedMarkerRow };
  }

  static createDeleteButton() {
    return Ui.fromHTML(`
      <button type="button" class="icon-button danger secondary btn-delete">
        <i class="bi bi-trash-fill"></i>
      </button>
    `);
  }

  static createCancelButton() {
    return Ui.fromHTML(`
      <button type="button" class="secondary btn-cancel">
        <i class="bi bi-x"></i> Cancel
      </button>
    `);
  }

  static createSaveButton() {
    return Ui.fromHTML(`
      <button type="button" class="btn-save">
        <i class="bi bi-floppy2-fill"></i> Save
      </button>
    `);
  }

  static createCreateButton() {
    return Ui.fromHTML(`
      <button type="button" class="btn-create">
        <i class="bi bi-plus-circle-fill"></i> Create
      </button>
    `);
  }

  static createClearButton() {
    return Ui.fromHTML(`
      <button type="button" class="secondary outline btn-clear">
        <i class="bi bi-eraser-fill"></i> Clear
      </button>
    `);
  }

  static createEnableEditModeButton() {
    return Ui.fromHTML(`
      <button type="button" class="icon-button">
        <i class="bi bi-pencil-fill"></i>
      </button>
    `);
  }

  static createUpdateMessage() {
    return Ui.fromHTML(`
      <div class="update-message">
        <i class="bi bi-exclamation-circle-fill" /> Editing. Click "Save" to save changes.
      </div>  
    `);
  }

  static createTextCell(text) {
    return Ui.fromHTML(`
      <td>
        ${text}
      </td>
    `);
  }
  static createTextInputCell(value) {
    return Ui.fromHTML(`
      <td>
        <input type="text" value="${value}" />
      </td>
    `);
  }

  static createCheckboxCell(checked, disabled = false, onChangeCallback) {
    const checkboxCell = Ui.fromHTML(
      `
        <td>
          <input type="checkbox" ${checked ? 'checked="checked"' : ""} ${
        disabled ? 'disabled="true"' : ""
      } />
        </td>
      `
    );

    checkboxCell.children[0].onchange = onChangeCallback ?? undefined;

    return checkboxCell;
  }

  static createDateInputCell(maybeDate) {
    try {
      let dateInputValue = "";

      if (maybeDate) {
        const dueDate = new Date(maybeDate);
        var year = dueDate.toLocaleString("default", { year: "numeric" });
        var month = dueDate.toLocaleString("default", { month: "2-digit" });
        var day = dueDate.toLocaleString("default", { day: "2-digit" });

        dateInputValue = `${year}-${month}-${day}`;
      }

      return Ui.fromHTML(
        `
        <td>
          <input type="date" value="${dateInputValue}" />
        </td>
        `
      );
    } catch {
      return Ui.fromHTML(`<td></td>`);
    }
  }

  static createDateDisplayCell(maybeDate, dueDatePassed) {
    try {
      const dateText = maybeDate
        ? new Date(maybeDate).toLocaleDateString()
        : "";

      if (!dateText) throw new Error();

      const dateCellClass = dueDatePassed ? "overdue" : "";
      const dateCellIcon = dueDatePassed
        ? '<i title="Overdue" class="bi-exclamation-circle-fill"></i>'
        : "";

      return Ui.fromHTML(
        `
        <td class="${dateCellClass}">
          ${dateText} ${dateCellIcon}
        </td>
      `
      );
    } catch {
      return document.createElement("td");
    }
  }

  /**
   * @param {String} HTML representing a single element.
   * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
   * @return {Element | HTMLCollection | null}
   */
  static fromHTML(html, trim = true) {
    // Process the HTML string.
    html = trim ? html.trim() : html;
    if (!html) return null;

    // Then set up a new template element.
    const template = document.createElement("template");
    template.innerHTML = html;
    const result = template.content.children;

    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length === 1) return result[0];
    return result;
  }
}
