
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Upload, Zap, Database } from 'lucide-react';

const TopBar = () => {
  const [nvidiaConnected, setNvidiaConnected] = useState(false);
  const [solAccess, setSolAccess] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          {/* NVIDIA API Connection */}
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="font-medium">NVIDIA APIs</span>
            <Badge variant={nvidiaConnected ? "default" : "secondary"} className="ml-2">
              {nvidiaConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button
              size="sm"
              variant={nvidiaConnected ? "outline" : "default"}
              onClick={() => setNvidiaConnected(!nvidiaConnected)}
              className="ml-2"
            >
              {nvidiaConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>

          {/* Sol Access Toggle */}
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Sol Access</span>
            <Switch
              checked={solAccess}
              onCheckedChange={setSolAccess}
              className="ml-2"
            />
          </div>
        </div>

        {/* Dataset Upload */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Dataset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
