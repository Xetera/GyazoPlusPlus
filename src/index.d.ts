export namespace Gyazo {
    type aliasId = string;


    interface GyazoStorage {
        [key:string]: aliasId;
    }


    interface User {
        name: string;
        icon_url: string;
    }

    interface Scale {
        width: number;
        height: number;
        scale: number;
    }

    interface Metadata {
        app: string;
        title: string;
    }
    interface Thumbnails {
        large_url :string;
        medium_url: string;
        mobile_2x_url: string;
        small_url: string;
    }
    // certain properties are missing because they are not sent and/or relevant
    interface PreloadData {
        access_policy: string | "anyone";
        accessible: boolean;
        alias_id: aliasId;
        created_at: Date;
        deletable: boolean;
        desc: string;
        explicit: boolean;
        external_comments : string[];
        file_size: number;
        grid_thumbs: Thumbnails;
        has_mp4: boolean;
        image_id: string;
        is_preview_gif: false;
        is_pro: boolean;
        metadata: Metadata;
        metadata_is_public: boolean;
        owned: true; // this is the crucial property that we're looking for
        permalink_path: string;
        permalink_url: string;
        poster_thumb_url: string;
        scale: Scale;
        thumb_url: string;
        url: string;
        user : User ;
    }
}