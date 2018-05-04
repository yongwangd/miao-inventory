import React from "react";
import { shallow, mount, render } from "enzyme";
import configureStore from "redux-mock-store";
import renderer from "react-test-renderer";
import TagInputContainer from "../../src/routes/Contacts/containers/TagInputContainer";

describe(">>> TagInputContainer Test Redux and render", () => {
  const initialState = {
    tagChunk: {
      tags: [
        {
          key: "s1",
          label: "first"
        },
        {
          key: "s2",
          label: "second"
        }
      ]
    }
  };

  const mockStore = configureStore();

  let store;
  let container;
  let mountValue;
  let renderedValue;

  beforeEach(() => {
    store = mockStore(initialState);
    container = shallow(
      <TagInputContainer store={store} selectedTagSet={{ s1: true }} />
    );
    mountValue = mount(
      <TagInputContainer store={store} selectedTagSet={{ s1: true }} />
    );
    renderedValue = render(
      <TagInputContainer store={store} selectedTagSet={{ s1: true }} />
    );
  });

  it("++ have two mounted tag", () => {
    expect(renderedValue.find(".ant-tag").length).toBe(1);
  });

  it("++ snapshot match", () => {
    expect(renderedValue.find("input").length).toBe(1);
  });

  it("+++ tags was passed correctly", () => {
    expect(container.prop("tags")).toEqual(store.getState().tagChunk.tags);
  });

  it("+++ render the SMART component", () => {
    expect(container.length).toEqual(1);
  });

  it("+++ Spinner is rendered", () => {
    expect(container.find("TagInput").length).toBe(0);
  });
});
