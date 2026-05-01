import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Medications } from "./pages/Medications";
import { AddMedication } from "./pages/AddMedication";
import { EditMedication } from "./pages/EditMedication";
import { CaregiverView } from "./pages/CaregiverView";
import { NotFound } from "./pages/NotFound";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "medications", Component: Medications },
      { path: "medications/add", Component: AddMedication },
      { path: "medications/edit/:id", Component: EditMedication },
      { path: "caregiver", Component: CaregiverView },
      { path: "*", Component: NotFound },
    ],
  },
]);
