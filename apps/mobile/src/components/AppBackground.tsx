import { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { backgroundStyles as styles} from "../styles/background.styles"

type Props = {
  children: ReactNode;
};

export default function AppBackground({ children }: Props) {
  return (
    <LinearGradient
      colors={[
        "#9FBEC4", // matches logo background
        "#DDEBED", // soft fade
        "#F8FAFC", // clean bottom
      ]}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}