import React from "react";
import { shallow } from "enzyme";
import TagListHeader from "../../src/routes/Contacts/components/TagListHeader";

describe("Component TagListHeader", () => {
  const tags = [
    { key: "1", label: "first" },
    { key: "2", label: "second" },
    { key: "3", label: "third" }
  ];
  const activeTagKeys = ["2"];
  const onTagClick = jest.fn();

  let TagList;
  beforeEach(() => {
    TagList = shallow(
      <TagListHeader
        tags={tags}
        activeTagKeys={activeTagKeys}
        onTagClick={onTagClick}
      />
    );
  });

  it("++ TagList rendered", () => {
    expect(TagList.length).toBe(1);
  });

  it("should have three tags", () => {
    expect(TagList.find("Tag").length).toEqual(3);
    expect(TagList.find("span").length).toEqual(1);
  });

  it("Tag Labels are correct", () => {
    expect(TagList.find("span").length).toEqual(1);
    expect(
      TagList.find("Tag")
        .first()
        .children()
        .text()
    ).toEqual("first");
    expect(
      TagList.find("Tag")
        .at(2)
        .children()
        .text()
    ).toEqual("third");
  });

  it("Tags have the correct color", () => {
    expect(
      TagList.find("Tag")
        .first()
        .prop("color")
    ).toEqual("blue");
    expect(
      TagList.find("Tag")
        .at(1)
        .prop("color")
    ).toEqual("#f50");
  });
});
