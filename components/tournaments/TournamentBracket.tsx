import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Clock, 
  Play, 
  Crown, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tournament, TournamentBracket as BracketType, TournamentParticipant } from '../../types';
import { cn } from '../../lib/utils';

interface TournamentBracketProps {
  tournament: Tournament;
  onSpectateMatch?: (gameId: string) => void;
  onBack?: () => void;
}

interface BracketMatch {
  id: string;
  round: number;
  match: number;
  participants: TournamentParticipant[];
  winner?: TournamentParticipant;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  gameId?: string;
  startTime?: string;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ 
  tournament, 
  onSpectateMatch, 
  onBack 
}) => {
  const [selectedRound, setSelectedRound] = useState(1);
  const [liveMatches, setLiveMatches] = useState<string[]>([]);

  // Generate bracket structure from tournament data
  const generateBracketMatches = (): BracketMatch[] => {
    const matches: BracketMatch[] = [];
    const totalRounds = Math.ceil(Math.log2(tournament.maxParticipants));
    
    // Create matches for each round
    for (let round = 1; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round);
      
      for (let match = 1; match <= matchesInRound; match++) {
        const bracketData = tournament.brackets.find(
          b => b.round === round && b.match === match
        );
        
        const participants = bracketData?.participants.map(pId => 
          tournament.participants.find(p => p.userId === pId)
        ).filter(Boolean) as TournamentParticipant[] || [];
        
        const winner = bracketData?.winner ? 
          tournament.participants.find(p => p.userId === bracketData.winner) : 
          undefined;

        matches.push({
          id: `${round}-${match}`,
          round,
          match,
          participants,
          winner,
          status: bracketData?.status || 'PENDING',
          gameId: bracketData?.gameId
        });
      }
    }
    
    return matches;
  };

  const bracketMatches = generateBracketMatches();
  const totalRounds = Math.max(...bracketMatches.map(m => m.round));
  const currentRoundMatches = bracketMatches.filter(m => m.round === selectedRound);

  // Simulate live match updates
  useEffect(() => {
    const interval = setInterval(() => {
      const inProgressMatches = bracketMatches
        .filter(m => m.status === 'IN_PROGRESS')
        .map(m => m.id);
      setLiveMatches(inProgressMatches);
    }, 2000);

    return () => clearInterval(interval);
  }, [bracketMatches]);

  const getRoundName = (round: number) => {
    const matchesInRound = Math.pow(2, totalRounds - round);
    if (matchesInRound === 1) return 'Final';
    if (matchesInRound === 2) return 'Semi-Finals';
    if (matchesInRound === 4) return 'Quarter-Finals';
    return `Round ${round}`;
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getParticipantAvatar = (participant: TournamentParticipant) => {
    // In a real app, this would return the actual avatar
    return participant.username.charAt(0).toUpperCase();
  };

  const getTierColor = (tier: string) => {
    const colors = {
      'BRONZE': 'text-amber-600',
      'SILVER': 'text-gray-500',
      'GOLD': 'text-yellow-500',
      'PLATINUM': 'text-cyan-500',
      'DIAMOND': 'text-blue-500',
      'MASTER': 'text-purple-500',
      'GRANDMASTER': 'text-red-500'
    };
    return colors[tier as keyof typeof colors] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {onBack && (
              <Button onClick={onBack} variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-600" />
                {tournament.name}
              </h1>
              <p className="text-gray-600">Tournament Bracket</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {tournament.currentParticipants} participants
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {tournament.prizePool.toLocaleString()} coins
            </Badge>
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center gap-1",
                tournament.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' : 
                tournament.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              )}
            >
              {tournament.status === 'IN_PROGRESS' ? <Play className="w-3 h-3" /> : 
               tournament.status === 'COMPLETED' ? <Crown className="w-3 h-3" /> : 
               <Clock className="w-3 h-3" />}
              {tournament.status.replace('_', ' ')}
            </Badge>
          </div>
        </motion.div>

        {/* Round Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRound(Math.max(1, selectedRound - 1))}
            disabled={selectedRound === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => (
              <Button
                key={round}
                variant={selectedRound === round ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRound(round)}
                className="min-w-[100px]"
              >
                {getRoundName(round)}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRound(Math.min(totalRounds, selectedRound + 1))}
            disabled={selectedRound === totalRounds}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Bracket Matches */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRound}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(4, currentRoundMatches.length)}, 1fr)`
            }}
          >
            {currentRoundMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  match.status === 'IN_PROGRESS' && liveMatches.includes(match.id) 
                    ? "ring-2 ring-green-400 shadow-lg" 
                    : "hover:shadow-md"
                )}>
                  {/* Live indicator */}
                  {match.status === 'IN_PROGRESS' && liveMatches.includes(match.id) && (
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Match {match.match}</span>
                      <Badge className={getMatchStatusColor(match.status)}>
                        {match.status.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Participants */}
                    <div className="space-y-2">
                      {match.participants.length > 0 ? (
                        match.participants.map((participant, pIndex) => (
                          <div
                            key={participant.userId}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-lg transition-colors",
                              match.winner?.userId === participant.userId 
                                ? "bg-yellow-100 border border-yellow-300" 
                                : "bg-gray-50"
                            )}
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {getParticipantAvatar(participant)}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{participant.username}</div>
                              <div className={cn("text-xs", getTierColor(participant.tier))}>
                                {participant.tier}
                              </div>
                            </div>
                            {match.winner?.userId === participant.userId && (
                              <Crown className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <div className="text-sm">Waiting for participants</div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {match.status === 'IN_PROGRESS' && match.gameId && onSpectateMatch && (
                      <Button
                        onClick={() => onSpectateMatch(match.gameId!)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Spectate Match
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Tournament Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {tournament.rules.gameMode === 'quick' ? 
                  <Zap className="w-4 h-4 text-yellow-600" /> : 
                  <Target className="w-4 h-4 text-blue-600" />
                }
                <span className="font-semibold">Game Mode</span>
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {tournament.rules.gameMode} • {tournament.rules.timeLimit}min limit
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="font-semibold">Elimination</span>
              </div>
              <p className="text-sm text-gray-600">
                {tournament.rules.eliminationStyle} elimination
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-semibold">Started</span>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(tournament.startTime).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TournamentBracket;
