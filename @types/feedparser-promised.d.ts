declare module "feedparser-promised" {
  export interface FeedParserPromised {
    parse(url: string): Promise<import("feedparser").Item[]>
  }

  declare const feedparserPromised: FeedParserPromised

  export default feedparserPromised
}
