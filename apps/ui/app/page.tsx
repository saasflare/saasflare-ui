// @reviewed 2026-04-18
"use client"

import {Button, UserAvatar} from "@saasflare/ui";
import {useEffect, useState} from "react";

export default function Page() {
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    })

  return (
    <main className={'flex h-[5000] min-h-screen flex-col items-center gap-y-5 p-24'}>
      <h1>Saasflare UI</h1>
      <p>Component library demo</p>
        <Button variant="ghost" onClick={() => console.log("test")}>Button</Button>
        <Button variant="link">Button</Button>
        <Button variant="soft">Button</Button>
        <Button variant="solid">Button</Button>
        <Button variant="shadow" className="invert">Button</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline" fullWidth loading={loading}>Button</Button>
      <UserAvatar src={"https://media.licdn.com/dms/image/v2/D4E03AQGEs8OYEo0j5g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726815764755?e=1779926400&v=beta&t=jr6oR9MlZ0h1WRbwP00i2hngT1s888ypaz-CMOLoovs"} name={"Dr. Chris"} initials={"CM"}/>
    </main>
  );
}
