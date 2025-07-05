import { FC } from "react";
import { Box } from "@components/primitives";
import styles from "./Top8Grid.module.css";

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  icon?: string;
}

interface Top8GridProps {
  friends: Friend[];
  onFriendClick?: (friend: Friend) => void;
}

export const Top8Grid: FC<Top8GridProps> = ({ friends, onFriendClick }) => {
  const displayFriends = friends.slice(0, 8);

  return (
    <div className={styles.grid}>
      {displayFriends.map((friend) => (
        <Box
          key={friend.id}
          className={styles.friendCard}
          onClick={() => onFriendClick?.(friend)}
        >
          <div className={styles.avatar}>
            {friend.avatar ? (
              <img src={friend.avatar} alt={friend.name} />
            ) : (
              <span className={styles.icon}>{friend.icon || "👤"}</span>
            )}
          </div>
          <div className={styles.name}>{friend.name}</div>
        </Box>
      ))}
    </div>
  );
};