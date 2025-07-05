import React, { useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import KeyForm from "./KeyForm";
import KeyTable from "./KeyTable";
import Navbar from "./Navbar";
import { GradientBackdrop } from "@/components/ui/backdrop";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { toast } from "sonner";

const Home = () => {
  useEffect(() => {
    // Welcome toast on component mount
    toast.success("Welcome back!", {
      description: "Manage your API keys securely."
    });
  }, []);

  return (
    <GradientBackdrop 
      className="w-screen h-screen"
      gradientFrom="from-indigo-400" 
      gradientTo="to-violet-700"
      opacity="opacity-30"
      blur="blur-2xl"
    >
      <div className="w-screen h-screen flex flex-col">
        <AnimatedContainer animation="fadeIn" className="w-full">
          <Navbar />
        </AnimatedContainer>

        <AnimatedContainer 
          animation="slideUp" 
          delay={0.2}
          className="flex-1 overflow-hidden"
        >
          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-full border rounded-lg shadow-lg bg-background/70 backdrop-blur-sm border-slate-200/30 m-4 h-[calc(100%-2rem)]"
          >
            <ResizablePanel defaultSize={25} minSize={20} className="h-full w-full flex justify-center items-center">
              <div className="w-full h-full p-4 overflow-auto">
                <AnimatedContainer animation="scaleIn" delay={0.3}>
                  <KeyForm />
                </AnimatedContainer>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} minSize={50} className="h-full w-full flex">
              <div className="flex h-full w-full justify-center items-start p-4 overflow-auto">
                <AnimatedContainer animation="scaleIn" delay={0.4} className="w-full max-w-5xl">
                  <KeyTable />
                </AnimatedContainer>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </AnimatedContainer>
      </div>
    </GradientBackdrop>
  );
};

export default Home;
