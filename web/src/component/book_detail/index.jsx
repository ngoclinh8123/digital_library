import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col } from "antd";
import BookView from "component/book/dialog/book_view";
import { urls } from "./config";
import styles from "./book_detail.module.css";
import BookSuggest from "./book_suggest";

export default function BookDetail() {
  const [book, setBook] = useState({});
  const { id } = useParams();
  const url_book_detail = `${urls.crud}${id}`;

  const getBookData = () => {
    // RequestUtil.apiCall(url_book_detail)
    //   .then((res) => {
    //     setBook(res.data);
    //   })
    //   .catch(() => {})
    //   .finally(() => {});

    setBook({
      id: 1,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      language: "VIETNAMESE",
      publisher: "Nhà xuất bản mặt trời",
      quality: 1,
      publication_date: "20/07/2023",
      price: 79000,
      thumbnail:
        "https://sachhay24h.com/uploads/1350087487_tuoitredanggiabaonhieu.jpg",
      description:
        "Tuổi trẻ được xem là lứa tuổi đẹp nhất của một đời người, thế nhưng có bao giờ thì tuổi xuân qua đi, bạn lại cảm thấy tiếc nuối vì những gì mà mình chưa làm được không? Với những lời tâm sự bình dị và gần gũi, cuốn sách “Tuổi trẻ đáng giá bao nhiêu” của tác giả Rosie Nguyễn sẽ giúp người đọc cảm nhận rõ nét nhất về tâm lý của những người trẻ trong xã hội ngày nay.",
      file: "",
      categories: ["self help", "romance"],
      authors: ["Rosie Nguyễn"],
      racks: [1, 2],
    });
  };

  const list_books = [
    {
      id: 1,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      language: "VIETNAMESE",
      publisher: "Nhà xuất bản mặt trời",
      quality: 1,
      publication_date: "20/07/2023",
      price: 79000,
      thumbnail:
        "https://sachhay24h.com/uploads/1350087487_tuoitredanggiabaonhieu.jpg",
      description:
        "Tuổi trẻ được xem là lứa tuổi đẹp nhất của một đời người, thế nhưng có bao giờ thì tuổi xuân qua đi, bạn lại cảm thấy tiếc nuối vì những gì mà mình chưa làm được không? Với những lời tâm sự bình dị và gần gũi, cuốn sách “Tuổi trẻ đáng giá bao nhiêu” của tác giả Rosie Nguyễn sẽ giúp người đọc cảm nhận rõ nét nhất về tâm lý của những người trẻ trong xã hội ngày nay.",
      file: "",
      categories: ["self help", "romance"],
      authors: ["Rosie Nguyễn"],
      racks: [1, 2],
    },
    {
      id: 1,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      language: "VIETNAMESE",
      publisher: "Nhà xuất bản mặt trời",
      quality: 1,
      publication_date: "20/07/2023",
      price: 79000,
      thumbnail:
        "https://sachhay24h.com/uploads/1350087487_tuoitredanggiabaonhieu.jpg",
      description:
        "Tuổi trẻ được xem là lứa tuổi đẹp nhất của một đời người, thế nhưng có bao giờ thì tuổi xuân qua đi, bạn lại cảm thấy tiếc nuối vì những gì mà mình chưa làm được không? Với những lời tâm sự bình dị và gần gũi, cuốn sách “Tuổi trẻ đáng giá bao nhiêu” của tác giả Rosie Nguyễn sẽ giúp người đọc cảm nhận rõ nét nhất về tâm lý của những người trẻ trong xã hội ngày nay.",
      file: "",
      categories: ["self help", "romance"],
      authors: ["Rosie Nguyễn"],
      racks: [1, 2],
    },
    {
      id: 1,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      language: "VIETNAMESE",
      publisher: "Nhà xuất bản mặt trời",
      quality: 1,
      publication_date: "20/07/2023",
      price: 79000,
      thumbnail:
        "https://sachhay24h.com/uploads/1350087487_tuoitredanggiabaonhieu.jpg",
      description:
        "Tuổi trẻ được xem là lứa tuổi đẹp nhất của một đời người, thế nhưng có bao giờ thì tuổi xuân qua đi, bạn lại cảm thấy tiếc nuối vì những gì mà mình chưa làm được không? Với những lời tâm sự bình dị và gần gũi, cuốn sách “Tuổi trẻ đáng giá bao nhiêu” của tác giả Rosie Nguyễn sẽ giúp người đọc cảm nhận rõ nét nhất về tâm lý của những người trẻ trong xã hội ngày nay.",
      file: "",
      categories: ["self help", "romance"],
      authors: ["Rosie Nguyễn"],
      racks: [1, 2],
    },
    {
      id: 1,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      language: "VIETNAMESE",
      publisher: "Nhà xuất bản mặt trời",
      quality: 1,
      publication_date: "20/07/2023",
      price: 79000,
      thumbnail:
        "https://sachhay24h.com/uploads/1350087487_tuoitredanggiabaonhieu.jpg",
      description:
        "Tuổi trẻ được xem là lứa tuổi đẹp nhất của một đời người, thế nhưng có bao giờ thì tuổi xuân qua đi, bạn lại cảm thấy tiếc nuối vì những gì mà mình chưa làm được không? Với những lời tâm sự bình dị và gần gũi, cuốn sách “Tuổi trẻ đáng giá bao nhiêu” của tác giả Rosie Nguyễn sẽ giúp người đọc cảm nhận rõ nét nhất về tâm lý của những người trẻ trong xã hội ngày nay.",
      file: "",
      categories: ["self help", "romance"],
      authors: ["Rosie Nguyễn"],
      racks: [1, 2],
    },
    {
      id: 1,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      language: "VIETNAMESE",
      publisher: "Nhà xuất bản mặt trời",
      quality: 1,
      publication_date: "20/07/2023",
      price: 79000,
      thumbnail:
        "https://sachhay24h.com/uploads/1350087487_tuoitredanggiabaonhieu.jpg",
      description:
        "Tuổi trẻ được xem là lứa tuổi đẹp nhất của một đời người, thế nhưng có bao giờ thì tuổi xuân qua đi, bạn lại cảm thấy tiếc nuối vì những gì mà mình chưa làm được không? Với những lời tâm sự bình dị và gần gũi, cuốn sách “Tuổi trẻ đáng giá bao nhiêu” của tác giả Rosie Nguyễn sẽ giúp người đọc cảm nhận rõ nét nhất về tâm lý của những người trẻ trong xã hội ngày nay.",
      file: "",
      categories: ["self help", "romance"],
      authors: ["Rosie Nguyễn"],
      racks: [1, 2],
    },
    {
      id: 1,
      title: "Tuổi trẻ đáng giá bao nhiêu",
      language: "VIETNAMESE",
      publisher: "Nhà xuất bản mặt trời",
      quality: 1,
      publication_date: "20/07/2023",
      price: 79000,
      thumbnail:
        "https://sachhay24h.com/uploads/1350087487_tuoitredanggiabaonhieu.jpg",
      description:
        "Tuổi trẻ được xem là lứa tuổi đẹp nhất của một đời người, thế nhưng có bao giờ thì tuổi xuân qua đi, bạn lại cảm thấy tiếc nuối vì những gì mà mình chưa làm được không? Với những lời tâm sự bình dị và gần gũi, cuốn sách “Tuổi trẻ đáng giá bao nhiêu” của tác giả Rosie Nguyễn sẽ giúp người đọc cảm nhận rõ nét nhất về tâm lý của những người trẻ trong xã hội ngày nay.",
      file: "",
      categories: ["self help", "romance"],
      authors: ["Rosie Nguyễn"],
      racks: [1, 2],
    },
  ];

  useEffect(() => {
    getBookData();
  }, [id]);

  return (
    <div className={styles.container}>
      <Row className={styles.content_wrap}>
        <Col span={14}>
          <BookView book={book} />
        </Col>
        <Col span={9}>
          <BookSuggest list_books={list_books} />
        </Col>
      </Row>
    </div>
  );
}
