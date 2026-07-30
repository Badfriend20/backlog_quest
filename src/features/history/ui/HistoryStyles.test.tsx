import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { describe, expect, it } from "vitest";
import { HistoryScope } from "./HistoryStyles";

describe("estilos del historial", () => {
  it("usa el color de texto del tema en las celdas de datos", () => {
    const sheet = new ServerStyleSheet();

    try {
      renderToString(
        sheet.collectStyles(
          <HistoryScope>
            <table>
              <thead>
                <tr>
                  <th>Campo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Dato de historial</td>
                </tr>
              </tbody>
            </table>
          </HistoryScope>
        )
      );

      const css = sheet.getStyleTags();
      expect(css).toContain("td{color:var(--text)");
      expect(css).not.toContain("#ddd6ea");
    } finally {
      sheet.seal();
    }
  });
});
