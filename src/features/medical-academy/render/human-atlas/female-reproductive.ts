export interface FemaleReproductiveOrgan {
  id: string;
  systemFocusId: string;
  name: string;
  description: string;
  path: string;
  color: string;
}

// These HRA reference organs use the same Visible Human Female coordinate frame.
export const FEMALE_REPRODUCTIVE_ORGANS: FemaleReproductiveOrgan[] = [
  {
    id: "uterus",
    systemFocusId: "uterus",
    name: "Uterus and cervix",
    description: "The uterus supports implantation and pregnancy. Its lower cervical portion connects with the vaginal canal.",
    path: "/models/anatomy/reproductive/uterus_hra_female_v1_2.glb",
    color: "#c86883",
  },
  {
    id: "left-ovary",
    systemFocusId: "ovary_left",
    name: "Left ovary",
    description: "The left ovary contains developing follicles, releases oocytes, and produces reproductive hormones.",
    path: "/models/anatomy/reproductive/ovary_hra_female_left_v1_1.glb",
    color: "#9b70a5",
  },
  {
    id: "right-ovary",
    systemFocusId: "ovary_right",
    name: "Right ovary",
    description: "The right ovary contains developing follicles, releases oocytes, and produces reproductive hormones.",
    path: "/models/anatomy/reproductive/ovary_hra_female_right_v1_1.glb",
    color: "#9b70a5",
  },
  {
    id: "left-tube",
    systemFocusId: "fallopian_tube_left",
    name: "Left fallopian tube",
    description: "The left uterine tube carries an oocyte toward the uterus; fertilization commonly occurs in its ampulla.",
    path: "/models/anatomy/reproductive/fallopian_tube_hra_female_left_v1_1.glb",
    color: "#d69c77",
  },
  {
    id: "right-tube",
    systemFocusId: "fallopian_tube_right",
    name: "Right fallopian tube",
    description: "The right uterine tube carries an oocyte toward the uterus; fertilization commonly occurs in its ampulla.",
    path: "/models/anatomy/reproductive/fallopian_tube_hra_female_right_v1_1.glb",
    color: "#d69c77",
  },
];
