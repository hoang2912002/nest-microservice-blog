import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  modal: ReactNode;
  children: ReactNode;
}>;
const VerifyLayout = ({ children, modal }: Props) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};
export default VerifyLayout;