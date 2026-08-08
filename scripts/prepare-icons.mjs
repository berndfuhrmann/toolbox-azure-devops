import { mkdir, readFile, writeFile, copyFile } from "fs/promises";

const icons = {
  "git-commit": "@tabler/icons/icons/outline/git-commit.svg",
  "git-branch": "@tabler/icons/icons/outline/git-branch.svg",
  "git-pull-request": "@tabler/icons/icons/outline/git-pull-request.svg",
  git: "@tabler/icons/icons/outline/brand-git.svg",
  organization: "@tabler/icons/icons/outline/building.svg",
  "organization-add": "@tabler/icons/icons/outline/building-plus.svg",
  "organization-remove": "@tabler/icons/icons/outline/building-minus.svg",
  "pat-update": "@tabler/icons/icons/outline/key.svg",
  project: "@tabler/icons/icons/outline/box.svg",
  folder: "@tabler/icons/icons/outline/folder.svg",
  file: "@tabler/icons/icons/outline/file.svg",
  refresh: "@tabler/icons/icons/outline/refresh.svg",
  link: "@tabler/icons/icons/outline/link.svg",
  error: "@tabler/icons/icons/outline/circle-x.svg",
  comments: "@tabler/icons/icons/outline/messages.svg",
  tags: "@tabler/icons/icons/outline/tags.svg",
  tag: "@tabler/icons/icons/outline/tag.svg",
  comment: "@tabler/icons/icons/outline/message.svg",
  paperclip: "@tabler/icons/icons/outline/paperclip.svg",
  pin: "@tabler/icons/icons/outline/pin.svg",
  "pinned-off": "@tabler/icons/icons/outline/pinned-off.svg",
  download: "@tabler/icons/icons/outline/download.svg",
  user: "@tabler/icons/icons/outline/user.svg",
  users: "@tabler/icons/icons/outline/users.svg",
  run: "@tabler/icons/icons/outline/run.svg",
  "git-pull-request-draft": "@tabler/icons/icons/outline/git-pull-request-draft.svg",
  pipeline: "../src-gen/icons/Production-Belt--Streamline-Core.svg",
  task: "@tabler/icons/icons/outline/checklist.svg",
  loading: "@tabler/icons/icons/outline/loader-2.svg",
  artifact: "@tabler/icons/icons/outline/archive.svg",
  edit: "@tabler/icons/icons/outline/edit.svg",
  dashboard: "@tabler/icons/icons/outline/dashboard.svg",
  "work-item": "@tabler/icons/icons/outline/checkbox.svg",
  wiki: "@tabler/icons/icons/outline/notebook.svg",
  "test-plan": "@tabler/icons/icons/outline/test-pipe.svg",
  agents: "@tabler/icons/icons/outline/cpu.svg",
  pool: "@tabler/icons/icons/outline/stack.svg",
  calendar: "@tabler/icons/icons/outline/calendar.svg",
  "list-details": "@tabler/icons/icons/outline/list-details.svg",
  "list-tree": "@tabler/icons/icons/outline/list-tree.svg",
  flag: "@tabler/icons/icons/outline/flag.svg",
  "user-question": "@tabler/icons/icons/outline/user-question.svg",
  mentioned: "@tabler/icons/icons/outline/at.svg",
  history: "@tabler/icons/icons/outline/history.svg",
};

const overlays = {
  pin: "@tabler/icons/icons/filled/pin.svg",
};

await mkdir(`${import.meta.dirname}/../dist/resources/icons`, {
  recursive: true,
});
await copyFile(
  `${import.meta.dirname}/../resources/icons/azure-devops.svg`,
  `${import.meta.dirname}/../dist/resources/icons/azure-devops.svg`,
);
await copyFile(
  `${import.meta.dirname}/../resources/icons/logo.png`,
  `${import.meta.dirname}/../dist/resources/icons/logo.png`,
);
for (const entry of Object.entries(icons)) {
  const importPath = entry[1];
  const content = await readFile(`${import.meta.dirname}/../node_modules/${importPath}`, "utf-8");
  const dark = content.replaceAll("currentColor", "#c5c5c5");
  const light = content.replaceAll("currentColor", "#000000");
  await mkdir(`${import.meta.dirname}/../dist/resources/dark`, {
    recursive: true,
  });
  await mkdir(`${import.meta.dirname}/../dist/resources/light`, {
    recursive: true,
  });
  await writeFile(`${import.meta.dirname}/../dist/resources/light/${entry[0]}.svg`, light);
  await writeFile(`${import.meta.dirname}/../dist/resources/dark/${entry[0]}.svg`, dark);
}

await mkdir(`${import.meta.dirname}/../dist/resources/overlays`, { recursive: true });
for (const entry of Object.entries(overlays)) {
  const importPath = entry[1];
  const content = await readFile(`${import.meta.dirname}/../node_modules/${importPath}`, "utf-8");
  const colored = content.replaceAll("currentColor", "#d6a500");
  await writeFile(`${import.meta.dirname}/../dist/resources/overlays/${entry[0]}.svg`, colored);
}
