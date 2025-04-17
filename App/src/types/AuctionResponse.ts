export interface AuctionResponse {
    Id: number;
    Name: string;
    Status: string;
    OwnerId: number;
    ProductId: number;
    StartTime: string;
    StartingPrice: number;
    EndTime: string;
    AuctionStatus: string;
    ProductName: string;
    ProductCategory: string;
    ImageFile: Uint8Array;
}
