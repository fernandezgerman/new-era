/**
=========================================================
* Material Dashboard 3 PRO React - v2.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 3 PRO React Base Styles
import colors from "../../base/colors";
import borders from "../../base/borders";
import boxShadows from "../../base/boxShadows";

// Material Dashboard 3 PRO React Helper Function
import rgba from "../../functions/rgba";

const { background, grey } = colors;
const { borderWidth, borderRadius } = borders;
const { xs } = boxShadows;

const card = {
  styleOverrides: {
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minWidth: 0,
      wordWrap: "break-word",
      backgroundImage: "none",
      backgroundColor: background.card,
      backgroundClip: "border-box",
      border: `${borderWidth[1]} solid ${grey[800]}`,
      borderRadius: borderRadius.lg,
      boxShadow: xs,
      overflow: "visible",
    },
  },
};

export default card;
