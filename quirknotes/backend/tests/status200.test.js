test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
  });

  const SERVER_URL = "http://127.0.0.1:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

const deleteAll = async () => {
  const deleteAllRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    body: {
      "Content-Type": "application/json",
    },
  });

   if (deleteAllRes.status !== 200) {
    throw new Error(`Failed to delete all notes. Status: ${deleteAllRes.status}`);
  }

  const deleteAllBody = await deleteAllRes.json();
  return deleteAllBody;
};

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  await deleteAll();

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();

  expect(getAllNotesRes.status).toBe(200);
  expect(Array.isArray(getAllNotesBody.response)).toBe(true);
  expect(getAllNotesBody.response.length).toBe(0);
});
test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  // Code here
  for (i = 0; i < 2; i++) {
      await fetch(`${SERVER_URL}/postNote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "title",
            content: "content",
          }),
      });
  }

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
  })

  const getAllNotesBody = await getAllNotesRes.json();
  
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(2);

  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }); 

  const deleteAllNotesBody = await deleteAllNotesRes.json();

  expect(deleteAllNotesRes.status).toBe(200)
  expect(deleteAllNotesBody.response).toBe(`2 note(s) deleted.`)
});

test("/deleteNote - Delete a note", async () => {
  const addedRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "test",
      content: "test",
    }),
  });

  const addedResBody = await addedRes.json();

  expect(addedRes.status).toBe(200);
  expect(addedResBody.response).toBe("Note added succesfully.");

  const deletedRes = await fetch(`${SERVER_URL}/deleteNote/${addedResBody.insertedId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const deletedBody = await deletedRes.json();

  expect(deletedRes.status).toBe(200);
  expect(deletedBody.response).toBe(`Document with ID ${addedResBody.insertedId} deleted.`);

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();

  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(0);

  await deleteAll();
});

test("/patchNote - Patch with content and title", async () => {
  const addedRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "test1",
      content: "test1",
    }),
  });

  const addedResBody = await addedRes.json();

  expect(addedRes.status).toBe(200);
  expect(addedResBody.response).toBe("Note added succesfully.");

  const patchRes = await fetch(`${SERVER_URL}/patchNote/${addedResBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "test2",
      content: "test2",
    }),
  });

  const patchBody = await patchRes.json();

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();

  expect(patchRes.status).toBe(200);
  expect(getAllNotesBody.response[0]).toMatchObject({
    title: "test2",
    content: "test2",
  });
  expect(patchBody.response).toBe(`Document with ID ${addedResBody.insertedId} patched.`);

  await deleteAll();
});

test("/patchNote - Patch with just title", async () => {
  const addedRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "randomtext",
      content: "randomtext",
    }),
  });

  const addedResBody = await addedRes.json();

  expect(addedRes.status).toBe(200);
  expect(addedResBody.response).toBe("Note added succesfully.");

  const patchRes = await fetch(`${SERVER_URL}/patchNote/${addedResBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "test3",
      content: "test3",
    }),
  });

  const patchBody = await patchRes.json();

  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAllNotesBody = await getAllNotesRes.json();

  expect(patchRes.status).toBe(200);
  expect(getAllNotesBody.response[0]).toMatchObject({
    title: "test3",
    content: "test3",
  });
  expect(patchBody.response).toBe(`Document with ID ${addedResBody.insertedId} patched.`);

  await deleteAll();
});

test("/patchNote - Patch with just content", async () => {
  const addedRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "random",
      content: "random",
    }),
  });
  
  const addedResBody = await addedRes.json();
  
  const patchRes = await fetch(`${SERVER_URL}/patchNote/${addedResBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "test4",
    }),
  });
  
  const patchBody = await patchRes.json();
  
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  const getAllNotesBody = await getAllNotesRes.json();
  
  expect(patchRes.status).toBe(200);
  expect(getAllNotesBody.response[0].title).toBe("random");
  expect(getAllNotesBody.response[0].content).toBe("test4");
  expect(patchBody.response).toBe(`Document with ID ${addedResBody.insertedId} patched.`);
  
  await deleteAll();
});

test("/deleteAllNotes - Delete one note", async () => {
  const addedRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `abc`,
      content: `abc`,
    }),
  });


  const deleteAllRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    body: {
      "Content-Type": "application/json",
    },
  });
  
  const deleteAllBody = await deleteAllRes.json();

  expect(deleteAllRes.status).toBe(200)
  expect(deleteAllBody.response).toBe(`1 note(s) deleted.` )
  await deleteAll()
});

test("/deleteAllNotes - Delete three notes", async () => {
  for(let i = 0; i < 3; i++){
    const addedRes = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `test`,
        content: `test`,
      }),
    });
  }

  const deleteAllRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
    body: {
      "Content-Type": "application/json",
    },
  });
  
  const deleteAllBody = await deleteAllRes.json();

  expect(deleteAllRes.status).toBe(200)
  expect(deleteAllBody.response).toBe(`3 note(s) deleted.` )
  await deleteAll()
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const addedRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `test`,
      content: `test`,
    }),
  });

  const addedResBody = await addedRes.json()

  const color = "#FF0000";
  const updateColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${addedResBody.insertedId}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ color }),
  });

  const updateColorBody = await updateColorRes.json();

  expect(updateColorRes.status).toBe(200)
  expect(updateColorBody.message).toBe(`Note color updated successfully.`)
  deleteAll()
});