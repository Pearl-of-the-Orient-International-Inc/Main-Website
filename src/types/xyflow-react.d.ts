/**
 * React Flow ships its stylesheet inside its package. Next.js bundles it at
 * runtime, while TypeScript needs an explicit declaration for this side-effect
 * CSS import to keep editor diagnostics clean.
 */
declare module "@xyflow/react/dist/style.css";
