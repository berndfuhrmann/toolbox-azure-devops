import { CommentThreadStatus, CommentType } from "azure-devops-node-api/interfaces/GitInterfaces";
import { formatDateTime } from "../../../../../src/common/date/dateFormat";
import {
  getCommentLabel,
  getLikeTags,
  getThreadComments,
  isResolved,
} from "../../../../../src/modules/repository/services/pullRequestComments";

const publishedDate = new Date("2026-11-25T14:05:00Z");

describe("getThreadComments", () => {
  test("separates the first comment from replies", () => {
    expect(getThreadComments({ comments: [{ id: 2 }, { id: 1 }, { id: 3 }] })).toEqual({
      firstComment: { id: 1 },
      replies: [{ id: 2 }, { id: 3 }],
    });
  });

  test("ignores threads by the system", () => {
    expect(
      getThreadComments({ properties: { CodeReviewThreadType: { $value: "VoteUpdate" } }, comments: [{ id: 1 }] }),
    ).toBeUndefined();
    expect(getThreadComments({ comments: [{ id: 1, commentType: CommentType.System }] })).toBeUndefined();
  });

  test("ignores deleted and empty threads", () => {
    expect(getThreadComments({ isDeleted: true, comments: [{ id: 1 }] })).toBeUndefined();
    expect(
      getThreadComments({
        comments: [
          { id: 1, isDeleted: true },
          { id: 2, isDeleted: true },
        ],
      }),
    ).toBeUndefined();
    expect(getThreadComments({})).toBeUndefined();
  });

  test("keeps a deleted first comment with replies, without deleted replies", () => {
    expect(
      getThreadComments({ comments: [{ id: 1, isDeleted: true }, { id: 2 }, { id: 3, isDeleted: true }] }),
    ).toEqual({ firstComment: { id: 1, isDeleted: true }, replies: [{ id: 2 }] });
  });
});

test.each([
  [undefined, false],
  [CommentThreadStatus.Unknown, false],
  [CommentThreadStatus.Active, false],
  [CommentThreadStatus.Pending, false],
  [CommentThreadStatus.Fixed, true],
  [CommentThreadStatus.WontFix, true],
  [CommentThreadStatus.Closed, true],
  [CommentThreadStatus.ByDesign, true],
])("isResolved %s: %s", (status, expected) => {
  expect(isResolved({ status })).toBe(expected);
});

test("getCommentLabel", () => {
  const comment = { author: { displayName: "Alex" }, publishedDate };
  expect(getCommentLabel(comment)).toBe(`Alex - ${formatDateTime(publishedDate)}`);
  expect(getCommentLabel({ ...comment, isDeleted: true })).toBe(`(deleted) - ${formatDateTime(publishedDate)}`);
  expect(getCommentLabel({})).toBe("Unknown");
});

test("getLikeTags", () => {
  const likeable = "gitRepository.pullRequest.likeableComment";
  const liked = "gitRepository.pullRequest.likedComment";
  expect(getLikeTags({}, "me")).toEqual({ [likeable]: true, [liked]: false });
  expect(getLikeTags({ usersLiked: [{ id: "other" }] }, "me")).toEqual({ [likeable]: true, [liked]: false });
  expect(getLikeTags({ usersLiked: [{ id: "ME" }] }, "me")).toEqual({ [likeable]: false, [liked]: true });
  expect(getLikeTags({ isDeleted: true }, "me")).toEqual({ [likeable]: false, [liked]: false });
});
