-- Sorry, it's only in another file because I like syntax highlighting 😢

create table if not exists rendered (
    id integer primary key autoincrement,

    -- This is the actual image data (jpg)
    -- these may supposedly be up to 1GB in size (vastly more than I would expect to store)
    imagedata blob not null,

    -- bounds (naturally)
    top_left_lat real not null,
    top_left_lon real not null,
    bottom_right_lat real not null,
    bottom_right_lon real not null,

    -- Unix Timestamp.
    created_at integer not null

    -- username of the user who created this render. do not scale with this model
    -- would need to change to a user id scheme
    -- user_name text not null,
    -- actual_name text not null,
)

