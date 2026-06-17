import { News } from "@/dummyData";
import { Flex, Modal } from "@mantine/core";
import NewsCard from "./NewsCard";

function NewsModal({ opened, close }) {
  return (
    <Modal opened={opened} onClose={close} size="90%" centered>
      <Flex gap={16} align={"center"} wrap={"wrap"}>
        {News.map((item) => (
          <NewsCard
            title={item.title}
            date={item.date}
            description={item.description}
            url={item.url}
          />
        ))}
      </Flex>
    </Modal>
  );
}

export default NewsModal;
