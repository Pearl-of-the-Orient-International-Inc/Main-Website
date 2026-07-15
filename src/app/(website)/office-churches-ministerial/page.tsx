import { officeDirectoryPages } from "../_components/office-directory-data";
import { OfficeDirectoryPage } from "../_components/office-directory-page";

const Page = () => {
  return <OfficeDirectoryPage data={officeDirectoryPages["office-churches-ministerial"]} />;
};

export default Page;
