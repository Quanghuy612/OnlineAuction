import { DateTime } from "luxon";

export interface AuctionResponse {
    Id: number;
    Name: string;
    StartTime: DateTime;
    EndTime: DateTime;
    StartingPrice: number;
    Status: string;
    ProductImage: File;
    ProductName: string;
}
