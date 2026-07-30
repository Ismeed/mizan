/**
 * Type compatibility shim for @types/react@19 + react-native 0.81
 *
 * React 19's @types/react adds `bigint` to ReactNode.
 * react-native 0.81's bundled ViewProps still expects the React 18 ReactNode
 * definition (without bigint), causing TS2769 errors on View, SafeAreaView etc.
 *
 * This declaration merges the correct ReactNode back into the global React namespace
 * so both the @types/react@19 definition and RN's internal references agree.
 *
 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/69006
 */
import 'react';

declare module 'react' {
  // Ensure ReactNode is compatible with both React 18 (RN renderer) and React 19 (our @types)
  // by explicitly excluding bigint from JSX children — ViewProps doesn't support primitives
  // that aren't numbers or strings anyway.
  type ReactNode =
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | boolean
    | null
    | undefined;
}
