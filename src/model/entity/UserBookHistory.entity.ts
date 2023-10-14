import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class UserBookHistory {
    @PrimaryGeneratedColumn({ name: "user_book_history_id" })
    userBookHistoryId: number;

    @Column({name : "bookshelf_id"})
    bookshelfId: number;

    @Column({ name: "start_datetime" })
    startDatetime: Date;

    @Column({ name: "end_datetime" })
    endDatetime: Date; // js-joda https://jojoldu.tistory.com/600
    
    @Column({name : "start_page"})
    startPage: number;

    @Column({name : "end_page"})
    endPage: number;

}