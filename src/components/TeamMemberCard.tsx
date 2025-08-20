import React from 'react';
import { User, Mail, Calendar, Building, Hash } from 'lucide-react';
import { TeamMember } from '../services/api';

interface TeamMemberCardProps {
  member: TeamMember;
  formatDate: (dateString?: string) => string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, formatDate }) => (
  <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl hover:shadow-2xl hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5">
    {/* Background glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    
    <div className="relative flex items-start gap-3">
      <div className="relative flex-shrink-0">
        <div className="p-2.5 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
          <User className="text-white" size={16} />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <h3 className="text-white font-semibold text-lg truncate group-hover:text-blue-300 transition-colors">
            {member.name}
          </h3>
          
          {member.team_name && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-green-300 text-xs font-medium">Team:</span> 
              <span className="text-white text-xs">{member.team_name}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <Building size={12} className="text-blue-400 flex-shrink-0" />
            <span className="text-gray-300 truncate">{member.project_name}</span>
          </div>

          {member.team_code && (
            <div className="flex items-center gap-2">
              <Hash size={12} className="text-orange-400 flex-shrink-0" />
              <span className="text-orange-300 font-mono text-xs bg-orange-500/10 px-1.5 py-0.5 rounded">
                {member.team_code}
              </span>
            </div>
          )}

          {member.email && (
            <div className="flex items-center gap-2 group/email cursor-pointer">
              <Mail size={12} className="text-purple-400 flex-shrink-0" />
              <span className="text-purple-300 truncate group-hover/email:text-purple-200 transition-colors text-xs">
                {member.email}
              </span>
            </div>
          )}

          {member.role && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span className="text-blue-300 text-xs font-medium">Role:</span> 
              <span className="text-white text-xs">{member.role}</span>
            </div>
          )}

          {member.created_at && (
            <div className="flex items-center gap-2 pt-1.5 border-t border-white/10">
              <Calendar size={10} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-400 text-xs">{formatDate(member.created_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Subtle shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
  </div>
);

export default TeamMemberCard;