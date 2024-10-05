let inv;

async function getConfirmacion() {
  let response;
  try {
    // Fetch first 10 files
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1pt8Lw2fP3_SX11WiXUxO4vFrBRuwX6HqdcQ11zCEBpk",
      range: "Confirmacion A:D",
    });
  } catch (err) {
    console.error(err);
    return;
  }

  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    console.warn("No se encuntraron");
    return;
  }

  inv = [];
  range.values.forEach((fila) => {
    if (isNaN(parseInt(fila[0])) || fila[5] !== undefined) return;
    const nuevoInv = {
      id: fila[0],
      nombre: fila[1],
      confirmacion: fila[2],
      mensaje: [3],
    };
    inv.push(nuevoInv);
  });
  console.log(inv);
}

//Ingresar Información a tabla
function updateValues(
  spreadsheetId,
  range,
  valueInputOption,
  _values,
  callback
) {
  let values = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  values = _values;
  const body = {
    values: values,
  };
  try {
    gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        resource: body,
      })
      .then((response) => {
        const result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
        if (callback) callback(response);
      });
  } catch (err) {
    document.getElementById("content").innerText = err.message;
    return;
  }
}
