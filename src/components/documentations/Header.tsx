import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ExternalLink, SearchIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { DocsMobileNav } from "@/components/documentations/MobileNav";
import { Badge } from "../ui/badge";
import Link from "next/link";

export const DocsHeader = () => {
  return (
    <header className="sticky top-0 inset-x-0 z-10 bg-background border-b">
      <div className="lg:px-20 px-4 py-5 mx-auto flex w-full items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-10">
          {/* Hamburger — mobile only */}
          <div className="lg:hidden">
            <DocsMobileNav />
          </div>

          <Link href="/documentation" className="flex w-full items-center gap-4">
            <Image
              src="/main/logo.png"
              className="lg:block hidden"
              alt="Logo"
              width={50}
              height={50}
            />
            <Image
              src="/main/logo.png"
              className="lg:hidden block"
              alt="Logo"
              width={35}
              height={35}
            />
            <div>
              <p className="text-xs lg:block hidden max-w-65 font-bold">
                Pearl of the Orient International Auxiliary Chaplain Values
                Educators Inc.
              </p>
              <p className="text-[10px] lg:block hidden mt-1 text-muted-foreground">
                Docs v1.0.5
              </p>
              <Badge variant="outline" className="lg:hidden text-[10px] block">
                Docs v1.0.5
              </Badge>
            </div>
          </Link>

          {/* Search — hidden on mobile */}
          <div className="hidden lg:block">
            <InputGroup className="lg:w-100">
              <InputGroupAddon>
                <SearchIcon className="size-4" />
                <span className="sr-only">Search</span>
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                placeholder="Search documentation..."
                className="[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
              />
              <InputGroupAddon align="inline-end">
                <Kbd>Ctrl + K</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="lg:block hidden">
            <ThemeSwitcher />
          </div>
          <div className="lg:hidden block">
            <Button size="icon-xs" variant="ghost">
              <SearchIcon className="size-4.5 p-0! text-muted-foreground" />
            </Button>
          </div>
          <Button size="sm" className="text-xs bg-[#032A0D]/90 text-white hover:bg-[#032A0D]/80">
            Homepage
            <ExternalLink className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
