Static card, in TaskList.tsx.

- Keep the task array in useState, and build all three behaviors against that state only.
- opens an inline input, Enter adds the task, and Escape cancels.
- The checkbox flips done. When done is true, give the title a strikethrough and a muted color, and when false, normal text.
- Clear finished keeps only the tasks where done is false. Disable the button when no task is finished.
