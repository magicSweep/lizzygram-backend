import {
  /*  isValidDate,
  isValidUserUid,
  isValidPhotoID,
  isValidTags,
  isValidPhotoFile,
  isValidDesc,
  isValidPhotoQuery,
  isValidPhotoDbRecordOnAdd,
  isValidPhotoDbRecordOnEdit, */
  isValidPhotoFile,
} from ".";

describe("isValidPhotoFile", () => {
  const possibilities = [
    {
      count: 0,
      photoFile: undefined as any,
      expected: "Неверный тип файла - undefined",
    },
    // mimetype, size
    {
      count: 1,
      photoFile: {
        mimetype: "application/json",
        size: 123,
      },
      expected:
        "Файл должен быть типа: jpeg, png, jpg, webp | application/json",
    },
    /*  {
      count: 2,
      photoFile: {
        mimetype: "image/png",
        size: 120001024,
      },
      expected: "Максимальный размер файла 21 Mb. | 120001024",
    }, */

    {
      count: 3,
      photoFile: null,
      expected: "Неверный тип файла - null",
    },

    {
      count: 4,
      photoFile: {},
      expected: "Неверный тип файла - {}",
    },

    {
      count: 5,
      photoFile: 13,
      expected: "Неверный тип файла - 13",
    },

    {
      count: 6,
      photoFile: {
        mimetype: "image/png",
        size: 12001024,
      },
      expected: true,
    },
  ];

  test.each(possibilities)(" - ${count}", ({ count, photoFile, expected }) => {
    expect(isValidPhotoFile(photoFile)).toBe(expected);
  });
});

/*   describe("isValidDate", () => {
    const possibilities = [
      { count: 0, date: undefined, expected: true },
      {
        count: 1,
        date: new Date().toUTCString(),
        expected: true,
      },

      { count: 2, date: "hello", expected: "Некорректная дата | hello" },
      { count: 3, date: "", expected: "Некорректная дата | " },

      { count: 4, date: null as any, expected: "Неверный формат даты | null" },

      { count: 5, date: 13 as any, expected: "Неверный формат даты | 13" },

      {
        count: 6,
        date: new Date("2016-07-08").toUTCString(),
        expected: "До дня рождения? | Fri, 08 Jul 2016 00:00:00 GMT",
      },
      {
        count: 7,
        date: new Date("2034-07-08").toUTCString(),
        expected: "Фотка сделана в будущем? | Sat, 08 Jul 2034 00:00:00 GMT",
      },
    ];

    test.each(possibilities)(" - ${count}", ({ date, expected }) => {
      expect(isValidDate(date)).toBe(expected);
    });
  });

  describe("isValidUserUid", () => {
    const possibilities = [
      {
        count: 0,
        userUid: undefined,
        expected: "UserUid must be  string | undefined",
      },
      {
        count: 1,
        userUid: 13 as any,
        expected: "UserUid must be  string | 13",
      },
      {
        count: 2,
        userUid: "!@#$sfdsdf",
        expected: 'Bad symbols in userUid... | "!@#$sfdsdf"',
      },
      {
        count: 3,
        userUid: "mf23WERersdf3234s",
        expected: true,
      },
    ];

    test.each(possibilities)(" - ${count}", ({ userUid, expected }) => {
      expect(isValidUserUid(userUid)).toBe(expected);
    });
  });

  describe("isValidPhotoQuery", () => {
    const possibilities = [
      {
        count: 1,
        photoQuery: 13 as any,
        expected: "photoQuery must be  string | 13",
      },
      {
        count: 2,
        photoQuery: "!@#$sfdsdf",
        expected: "photoQuery must contain 61 symbol...!@#$sfdsdf",
      },
      {
        count: 2,
        photoQuery:
          "123456fdsdf12e2e2e2e2e2e2e2e2e123456fdsdf12e2e2e2e2e2e!;2e2e3",
        expected:
          'Bad symbols in photoQuery... | "123456fdsdf12e2e2e2e2e2e2e2e2e123456fdsdf12e2e2e2e2e2e!;2e2e3"',
      },
      {
        count: 3,
        photoQuery:
          "123456fdsdf12e2e2e2e2e2e2e2e2e123456fdsdf12e2e2e2e2e2ee32e2e3",
        expected: true,
      },
    ];

    test.each(possibilities)(" - ${count}", ({ photoQuery, expected }) => {
      expect(isValidPhotoQuery(photoQuery)).toBe(expected);
    });
  });

  describe("isValidPhotoID", () => {
    const possibilities = [
      {
        count: 0,
        photoId: undefined,
        expected: "We have no photoId",
      },
      {
        count: 1,
        photoId: null,
        expected: "Photo id must be  string | null",
      },
      {
        count: 2,
        photoId: "hello13" as any,
        expected: 'Wrong photo id... | "hello13"',
      },
      {
        count: 3,
        photoId: 13,
        expected: "Photo id must be  string | 13",
      },
      {
        count: 4,
        photoId: "13hello",
        expected: 'Wrong photo id... | "13hello"',
      },
      {
        count: 5,
        photoId: (90000000000000 - Date.now()).toString(),
        expected: true,
      },
    ];

    test.each(possibilities)(" - ${count}", ({ photoId, expected }) => {
      expect(isValidPhotoID(photoId)).toBe(expected);
    });
  });

  describe("isValidTags", () => {
    const possibilities = [
      {
        count: 0,
        tags: undefined,
        expected: true,
      },
      {
        count: 1,
        tags: JSON.stringify({ hello: false, bye: false }),
        expected: 'Добавьте хотя бы один тэг. | {"hello":false,"bye":false}',
      },
      {
        count: 2,
        tags: JSON.stringify({ hello: true, bye: false }),
        expected: true,
      },
      {
        count: 3,
        tags: 13 as any,
        expected: "Какая-то ошибочка... | -2342- | 13",
      },
      {
        count: 4,
        tags: null as any,
        expected: "Какая-то ошибочка... | -2342- | null",
      },
      {
        count: 5,
        tags: JSON.stringify({}) as any,
        expected: "Добавьте хотя бы один тэг. | {}",
      },
    ];

    test.each(possibilities)(" - ${count}", ({ count, tags, expected }) => {
      expect(isValidTags(tags)).toBe(expected);
    });
  });


  describe("isValidPhotoDbRecordOnAdd", () => {
    const possibilities = [
      {
        count: 0,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: undefined,
        expected:
          "No photo record in Firestore on add with id photoId12344 | userUid - userUid123",
      },

      {
        count: 1,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: {
          addedByUserUID: "userUid345",
        } as any,
        expected:
          'Users uid does not match - userUid123 | {"addedByUserUID":"userUid345"}',
      },

      {
        count: 1,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: {
          id: "photo_id",
          addedByUserUID: "userUid123",
          isActive: true,
        } as any,
        expected: 'Photo to add is activated - "photo_id" | userUid123',
      },

      {
        count: 1,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: {
          id: "photo_id",
          addedByUserUID: "userUid123",
          isActive: false,
        } as any,
        expected: true,
      },
    ];

    test.each(possibilities)(
      " - ${count}",
      ({ count, photoId, photo, userUid, expected }) => {
        expect(isValidPhotoDbRecordOnAdd(photoId, photo, userUid)).toBe(
          expected
        );
      }
    );
  });

  describe("isValidPhotoDbRecordOnEdit", () => {
    const possibilities = [
      {
        count: 0,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: undefined,
        expected:
          "No photo record in Firestore on add with id photoId12344 | userUid - userUid123",
      },

      {
        count: 1,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: {
          addedByUserUID: "userUid345",
        } as any,
        expected:
          'Users uid does not match - userUid123 | {"addedByUserUID":"userUid345"}',
      },

      {
        count: 1,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: {
          id: "photo_id",
          addedByUserUID: "userUid123",
          isActive: false,
        } as any,
        expected: 'Photo to edit is not activated - "photo_id" | userUid123',
      },

      {
        count: 1,
        photoId: "photoId12344",
        userUid: "userUid123",
        photo: {
          id: "photo_id",
          addedByUserUID: "userUid123",
          isActive: true,
        } as any,
        expected: true,
      },
    ];

    test.each(possibilities)(
      " - ${count}",
      ({ count, photoId, photo, userUid, expected }) => {
        expect(isValidPhotoDbRecordOnEdit(photoId, photo, userUid)).toBe(
          expected
        );
      }
    );
  });
 */
