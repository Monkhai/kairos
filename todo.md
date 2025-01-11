# Needs clarification

- Creation in android is not correct - The android creation window is not right, ask for video if you need more it's hard to explain (might be fixed after move to a screen)
- Pressing a task item in list crashes the app - on android, trying to go into focused mode for a TaskItem crashed the app
- if you repeatedly pause and resume a timer it will do nothing - I dont know what to say about it, the timer just doesn't really track time, but more so does actions after a set amount of time, so repeatedly pausing and playing means the timer won't advance at all

# For OnBoarding

- card's swipability is not clear

# Ready to fix

- task deletion is currently marking tasks as done. They should be deleted from the DB
- deleting tasks when done filter is false causes issues
- Duration picker in focused mode appears before the focused window is opened
- Text length and alignment in task selection and active task is wrong (try long texts to see in action)
- Switching between fields in the creation modal was tricky, amaybe the move to a screen fixed it
