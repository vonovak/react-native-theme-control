import { useCallback, useEffect, useRef } from 'react';

export const MountedValue = <P,>({
  latestProps,
  onPropsChanged,
  arePropsEqual,
}: {
  latestProps: P;
  onPropsChanged: (arg: P) => void;
  arePropsEqual: (arg1: P | null, arg2: P) => boolean;
}) => {
  const stackEntry = useRef<P>(latestProps);
  const delayedUpdateID = useRef<ReturnType<typeof setImmediate> | null>(null);

  const currentProps = useRef<P | null>(null);
  const propsStack = useRef<P[]>([]);

  const updatePropsStack = useCallback(() => {
    // Send the update to the native module only once at the end of the frame.
    if (delayedUpdateID.current !== null) {
      clearImmediate(delayedUpdateID.current);
    }

    const updateImperatively = () => {
      const propsStackValue = propsStack.current;
      const lastEntry = propsStackValue[propsStack.current.length - 1];

      if (lastEntry != null) {
        // Update only if props have changed or if current props are null.
        if (!arePropsEqual(currentProps.current, lastEntry)) {
          onPropsChanged(lastEntry);
        }

        // Update the current props values.
        currentProps.current = lastEntry;
      } else {
        // Reset current props when the stack is empty.
        currentProps.current = null;
      }
    };
    delayedUpdateID.current = setImmediate(updateImperatively);
  }, [arePropsEqual, onPropsChanged]);

  const pushStackEntry = useCallback(
    <S extends P>(props: S): S => {
      propsStack.current.push(props);
      updatePropsStack();
      return props;
    },
    [updatePropsStack],
  );

  const popStackEntry = useCallback(
    <S extends P>(entry: S) => {
      const propsStackValue = propsStack.current;
      const index = propsStackValue.indexOf(entry);
      if (index !== -1) {
        propsStackValue.splice(index, 1);
      }
      updatePropsStack();
    },
    [updatePropsStack],
  );

  const replaceStackEntry = useCallback(
    <S extends P>(entry: S, newEntry: S): S => {
      const propsStackValue = propsStack.current;
      const index = propsStackValue.indexOf(entry);
      if (index !== -1) {
        propsStackValue[index] = newEntry;
      }
      updatePropsStack();
      return newEntry;
    },
    [updatePropsStack],
  );

  useEffect(() => {
    pushStackEntry(stackEntry.current);
    return () => {
      popStackEntry(stackEntry.current);
    };
  }, [pushStackEntry, popStackEntry]);

  useEffect(() => {
    const entry = stackEntry.current;
    if (!arePropsEqual(entry, latestProps)) {
      stackEntry.current = replaceStackEntry(entry, latestProps);
    }
  });

  return null;
};
