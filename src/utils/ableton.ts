import JSZip from 'jszip';
import type { InstrumentData, PatternData } from '@polyend/tracker-lib';

const MINOR_VERSION = '12.0_12300';

// ============================================================
// Templates extracted from real Ableton Live 12.3 projects
// ============================================================

const MIDI_TRACK_TPL = `			<MidiTrack Id="__TRACK_ID__" SelectedToolPanel="0" SelectedTransformationName="Arpeggiate" SelectedGeneratorName="Rhythm">
				<LomId Value="0" />
				<LomIdView Value="0" />
				<IsContentSelectedInDocument Value="false" />
				<PreferredContentViewMode Value="0" />
				<TrackDelay>
					<Value Value="0" />
					<IsValueSampleBased Value="false" />
				</TrackDelay>
				<Name>
					<EffectiveName Value="__TRACK_NAME__" />
					<UserName Value="" />
					<Annotation Value="" />
					<MemorizedFirstClipName Value="" />
				</Name>
				<Color Value="0" />
				<AutomationEnvelopes>
					<Envelopes />
				</AutomationEnvelopes>
				<TrackGroupId Value="-1" />
				<TrackUnfolded Value="true" />
				<DevicesListWrapper LomId="0" />
				<ClipSlotsListWrapper LomId="0" />
				<ArrangementClipsListWrapper LomId="0" />
				<TakeLanesListWrapper LomId="0" />
				<ViewData Value='{"}' />
				<TakeLanes>
					<TakeLanes />
					<AreTakeLanesFolded Value="true" />
				</TakeLanes>
				<LinkedTrackGroupId Value="-1" />
				<SavedPlayingSlot Value="-2" />
				<SavedPlayingOffset Value="0" />
				<Freeze Value="false" />
				<NeedArrangerRefreeze Value="true" />
				<PostProcessFreezeClips Value="0" />
				<DeviceChain>
					<AutomationLanes>
						<AutomationLanes>
							<AutomationLane Id="0">
								<SelectedDevice Value="1" />
								<SelectedEnvelope Value="1" />
								<IsContentSelectedInDocument Value="false" />
								<LaneHeight Value="68" />
							</AutomationLane>
						</AutomationLanes>
						<AreAdditionalAutomationLanesFolded Value="false" />
					</AutomationLanes>
					<ClipEnvelopeChooserViewState>
						<SelectedDevice Value="1" />
						<SelectedEnvelope Value="1" />
						<PreferModulationVisible Value="false" />
					</ClipEnvelopeChooserViewState>
					<AudioInputRouting>
						<Target Value="AudioIn/External/S0" />
						<UpperDisplayString Value="Ext. In" />
						<LowerDisplayString Value="1/2" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</AudioInputRouting>
					<MidiInputRouting>
						<Target Value="MidiIn/External.All/-1" />
						<UpperDisplayString Value="Ext: All Ins" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</MidiInputRouting>
					<AudioOutputRouting>
						<Target Value="AudioOut/Main" />
						<UpperDisplayString Value="Master" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</AudioOutputRouting>
					<MidiOutputRouting>
						<Target Value="MidiOut/None" />
						<UpperDisplayString Value="None" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</MidiOutputRouting>
					<Mixer>
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="__ID0__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="__ID1__" />
						<LastSelectedTimeableIndex Value="0" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<Sends>
							<TrackSendHolder Id="0">
								<Send>
									<LomId Value="0" />
									<Manual Value="0.0003162277571" />
									<MidiControllerRange>
										<Min Value="0.0003162277571" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="__ID2__">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="__ID3__">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Send>
								<EnabledByUser Value="true" />
							</TrackSendHolder>
							<TrackSendHolder Id="1">
								<Send>
									<LomId Value="0" />
									<Manual Value="0.0003162277571" />
									<MidiControllerRange>
										<Min Value="0.0003162277571" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="__ID4__">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="__ID5__">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Send>
								<EnabledByUser Value="true" />
							</TrackSendHolder>
						</Sends>
						<Speaker>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="__ID6__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</Speaker>
						<SoloSink Value="false" />
						<PanMode Value="0" />
						<Pan>
							<LomId Value="0" />
							<Manual Value="0" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="__ID7__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="__ID8__">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</Pan>
						<SplitStereoPanL>
							<LomId Value="0" />
							<Manual Value="-1" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="__ID9__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="__ID10__">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</SplitStereoPanL>
						<SplitStereoPanR>
							<LomId Value="0" />
							<Manual Value="1" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="__ID11__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="__ID12__">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</SplitStereoPanR>
						<Volume>
							<LomId Value="0" />
							<Manual Value="1" />
							<MidiControllerRange>
								<Min Value="0.0003162277571" />
								<Max Value="1.99526238" />
							</MidiControllerRange>
							<AutomationTarget Id="__ID13__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="__ID14__">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</Volume>
						<ViewStateSessionTrackWidth Value="93" />
						<CrossFadeState>
							<LomId Value="0" />
							<Manual Value="1" />
							<AutomationTarget Id="__ID15__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiControllerRange>
								<Min Value="0" />
								<Max Value="2" />
							</MidiControllerRange>
						</CrossFadeState>
						<SendsListWrapper LomId="0" />
					</Mixer>
					<MainSequencer>
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="__ID16__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="__ID17__" />
						<LastSelectedTimeableIndex Value="0" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<ClipSlotList>
__CLIP_SLOT_LIST_MAIN__
							</ClipSlotList>
						<MonitoringEnum Value="1" />
						<KeepRecordMonitoringLatency Value="true" />
						<ClipTimeable>
							<ArrangerAutomation>
								<Events />
								<AutomationTransformViewState>
									<IsTransformPending Value="false" />
									<TimeAndValueTransforms />
								</AutomationTransformViewState>
							</ArrangerAutomation>
						</ClipTimeable>
						<Recorder>
							<IsArmed Value="false" />
							<TakeCounter Value="1" />
						</Recorder>
						<MidiControllers>
							<ControllerTargets.0 Id="__ID18__">
								<LockEnvelope Value="0" />
							</ControllerTargets.0>
							<ControllerTargets.1 Id="__ID19__">
								<LockEnvelope Value="1" />
							</ControllerTargets.1>
							<ControllerTargets.2 Id="__ID20__">
								<LockEnvelope Value="0" />
							</ControllerTargets.2>
							<ControllerTargets.3 Id="__ID21__">
								<LockEnvelope Value="0" />
							</ControllerTargets.3>
							<ControllerTargets.4 Id="__ID22__">
								<LockEnvelope Value="0" />
							</ControllerTargets.4>
							<ControllerTargets.5 Id="__ID23__">
								<LockEnvelope Value="0" />
							</ControllerTargets.5>
							<ControllerTargets.6 Id="__ID24__">
								<LockEnvelope Value="0" />
							</ControllerTargets.6>
							<ControllerTargets.7 Id="__ID25__">
								<LockEnvelope Value="0" />
							</ControllerTargets.7>
							<ControllerTargets.8 Id="__ID26__">
								<LockEnvelope Value="0" />
							</ControllerTargets.8>
							<ControllerTargets.9 Id="__ID27__">
								<LockEnvelope Value="0" />
							</ControllerTargets.9>
							<ControllerTargets.10 Id="__ID28__">
								<LockEnvelope Value="0" />
							</ControllerTargets.10>
							<ControllerTargets.11 Id="__ID29__">
								<LockEnvelope Value="1" />
							</ControllerTargets.11>
							<ControllerTargets.12 Id="__ID30__">
								<LockEnvelope Value="0" />
							</ControllerTargets.12>
							<ControllerTargets.13 Id="__ID31__">
								<LockEnvelope Value="0" />
							</ControllerTargets.13>
							<ControllerTargets.14 Id="__ID32__">
								<LockEnvelope Value="0" />
							</ControllerTargets.14>
							<ControllerTargets.15 Id="__ID33__">
								<LockEnvelope Value="0" />
							</ControllerTargets.15>
							<ControllerTargets.16 Id="__ID34__">
								<LockEnvelope Value="0" />
							</ControllerTargets.16>
							<ControllerTargets.17 Id="__ID35__">
								<LockEnvelope Value="0" />
							</ControllerTargets.17>
							<ControllerTargets.18 Id="__ID36__">
								<LockEnvelope Value="0" />
							</ControllerTargets.18>
							<ControllerTargets.19 Id="__ID37__">
								<LockEnvelope Value="0" />
							</ControllerTargets.19>
							<ControllerTargets.20 Id="__ID38__">
								<LockEnvelope Value="0" />
							</ControllerTargets.20>
							<ControllerTargets.21 Id="__ID39__">
								<LockEnvelope Value="0" />
							</ControllerTargets.21>
							<ControllerTargets.22 Id="__ID40__">
								<LockEnvelope Value="0" />
							</ControllerTargets.22>
							<ControllerTargets.23 Id="__ID41__">
								<LockEnvelope Value="0" />
							</ControllerTargets.23>
							<ControllerTargets.24 Id="__ID42__">
								<LockEnvelope Value="0" />
							</ControllerTargets.24>
							<ControllerTargets.25 Id="__ID43__">
								<LockEnvelope Value="0" />
							</ControllerTargets.25>
							<ControllerTargets.26 Id="__ID44__">
								<LockEnvelope Value="0" />
							</ControllerTargets.26>
							<ControllerTargets.27 Id="__ID45__">
								<LockEnvelope Value="0" />
							</ControllerTargets.27>
							<ControllerTargets.28 Id="__ID46__">
								<LockEnvelope Value="0" />
							</ControllerTargets.28>
							<ControllerTargets.29 Id="__ID47__">
								<LockEnvelope Value="0" />
							</ControllerTargets.29>
							<ControllerTargets.30 Id="__ID48__">
								<LockEnvelope Value="0" />
							</ControllerTargets.30>
							<ControllerTargets.31 Id="__ID49__">
								<LockEnvelope Value="0" />
							</ControllerTargets.31>
							<ControllerTargets.32 Id="__ID50__">
								<LockEnvelope Value="0" />
							</ControllerTargets.32>
							<ControllerTargets.33 Id="__ID51__">
								<LockEnvelope Value="0" />
							</ControllerTargets.33>
							<ControllerTargets.34 Id="__ID52__">
								<LockEnvelope Value="0" />
							</ControllerTargets.34>
							<ControllerTargets.35 Id="__ID53__">
								<LockEnvelope Value="0" />
							</ControllerTargets.35>
							<ControllerTargets.36 Id="__ID54__">
								<LockEnvelope Value="0" />
							</ControllerTargets.36>
							<ControllerTargets.37 Id="__ID55__">
								<LockEnvelope Value="0" />
							</ControllerTargets.37>
							<ControllerTargets.38 Id="__ID56__">
								<LockEnvelope Value="0" />
							</ControllerTargets.38>
							<ControllerTargets.39 Id="__ID57__">
								<LockEnvelope Value="0" />
							</ControllerTargets.39>
							<ControllerTargets.40 Id="__ID58__">
								<LockEnvelope Value="0" />
							</ControllerTargets.40>
							<ControllerTargets.41 Id="__ID59__">
								<LockEnvelope Value="0" />
							</ControllerTargets.41>
							<ControllerTargets.42 Id="__ID60__">
								<LockEnvelope Value="0" />
							</ControllerTargets.42>
							<ControllerTargets.43 Id="__ID61__">
								<LockEnvelope Value="0" />
							</ControllerTargets.43>
							<ControllerTargets.44 Id="__ID62__">
								<LockEnvelope Value="0" />
							</ControllerTargets.44>
							<ControllerTargets.45 Id="__ID63__">
								<LockEnvelope Value="0" />
							</ControllerTargets.45>
							<ControllerTargets.46 Id="__ID64__">
								<LockEnvelope Value="0" />
							</ControllerTargets.46>
							<ControllerTargets.47 Id="__ID65__">
								<LockEnvelope Value="0" />
							</ControllerTargets.47>
							<ControllerTargets.48 Id="__ID66__">
								<LockEnvelope Value="0" />
							</ControllerTargets.48>
							<ControllerTargets.49 Id="__ID67__">
								<LockEnvelope Value="0" />
							</ControllerTargets.49>
							<ControllerTargets.50 Id="__ID68__">
								<LockEnvelope Value="0" />
							</ControllerTargets.50>
							<ControllerTargets.51 Id="__ID69__">
								<LockEnvelope Value="0" />
							</ControllerTargets.51>
							<ControllerTargets.52 Id="__ID70__">
								<LockEnvelope Value="0" />
							</ControllerTargets.52>
							<ControllerTargets.53 Id="__ID71__">
								<LockEnvelope Value="0" />
							</ControllerTargets.53>
							<ControllerTargets.54 Id="__ID72__">
								<LockEnvelope Value="0" />
							</ControllerTargets.54>
							<ControllerTargets.55 Id="__ID73__">
								<LockEnvelope Value="0" />
							</ControllerTargets.55>
							<ControllerTargets.56 Id="__ID74__">
								<LockEnvelope Value="0" />
							</ControllerTargets.56>
							<ControllerTargets.57 Id="__ID75__">
								<LockEnvelope Value="0" />
							</ControllerTargets.57>
							<ControllerTargets.58 Id="__ID76__">
								<LockEnvelope Value="0" />
							</ControllerTargets.58>
							<ControllerTargets.59 Id="__ID77__">
								<LockEnvelope Value="0" />
							</ControllerTargets.59>
							<ControllerTargets.60 Id="__ID78__">
								<LockEnvelope Value="0" />
							</ControllerTargets.60>
							<ControllerTargets.61 Id="__ID79__">
								<LockEnvelope Value="0" />
							</ControllerTargets.61>
							<ControllerTargets.62 Id="__ID80__">
								<LockEnvelope Value="0" />
							</ControllerTargets.62>
							<ControllerTargets.63 Id="__ID81__">
								<LockEnvelope Value="0" />
							</ControllerTargets.63>
							<ControllerTargets.64 Id="__ID82__">
								<LockEnvelope Value="0" />
							</ControllerTargets.64>
							<ControllerTargets.65 Id="__ID83__">
								<LockEnvelope Value="0" />
							</ControllerTargets.65>
							<ControllerTargets.66 Id="__ID84__">
								<LockEnvelope Value="1" />
							</ControllerTargets.66>
							<ControllerTargets.67 Id="__ID85__">
								<LockEnvelope Value="0" />
							</ControllerTargets.67>
							<ControllerTargets.68 Id="__ID86__">
								<LockEnvelope Value="0" />
							</ControllerTargets.68>
							<ControllerTargets.69 Id="__ID87__">
								<LockEnvelope Value="0" />
							</ControllerTargets.69>
							<ControllerTargets.70 Id="__ID88__">
								<LockEnvelope Value="0" />
							</ControllerTargets.70>
							<ControllerTargets.71 Id="__ID89__">
								<LockEnvelope Value="0" />
							</ControllerTargets.71>
							<ControllerTargets.72 Id="__ID90__">
								<LockEnvelope Value="0" />
							</ControllerTargets.72>
							<ControllerTargets.73 Id="__ID91__">
								<LockEnvelope Value="0" />
							</ControllerTargets.73>
							<ControllerTargets.74 Id="__ID92__">
								<LockEnvelope Value="0" />
							</ControllerTargets.74>
							<ControllerTargets.75 Id="__ID93__">
								<LockEnvelope Value="0" />
							</ControllerTargets.75>
							<ControllerTargets.76 Id="__ID94__">
								<LockEnvelope Value="0" />
							</ControllerTargets.76>
							<ControllerTargets.77 Id="__ID95__">
								<LockEnvelope Value="0" />
							</ControllerTargets.77>
							<ControllerTargets.78 Id="__ID96__">
								<LockEnvelope Value="0" />
							</ControllerTargets.78>
							<ControllerTargets.79 Id="__ID97__">
								<LockEnvelope Value="0" />
							</ControllerTargets.79>
							<ControllerTargets.80 Id="__ID98__">
								<LockEnvelope Value="0" />
							</ControllerTargets.80>
							<ControllerTargets.81 Id="__ID99__">
								<LockEnvelope Value="0" />
							</ControllerTargets.81>
							<ControllerTargets.82 Id="__ID100__">
								<LockEnvelope Value="0" />
							</ControllerTargets.82>
							<ControllerTargets.83 Id="__ID101__">
								<LockEnvelope Value="0" />
							</ControllerTargets.83>
							<ControllerTargets.84 Id="__ID102__">
								<LockEnvelope Value="0" />
							</ControllerTargets.84>
							<ControllerTargets.85 Id="__ID103__">
								<LockEnvelope Value="0" />
							</ControllerTargets.85>
							<ControllerTargets.86 Id="__ID104__">
								<LockEnvelope Value="0" />
							</ControllerTargets.86>
							<ControllerTargets.87 Id="__ID105__">
								<LockEnvelope Value="0" />
							</ControllerTargets.87>
							<ControllerTargets.88 Id="__ID106__">
								<LockEnvelope Value="0" />
							</ControllerTargets.88>
							<ControllerTargets.89 Id="__ID107__">
								<LockEnvelope Value="0" />
							</ControllerTargets.89>
							<ControllerTargets.90 Id="__ID108__">
								<LockEnvelope Value="0" />
							</ControllerTargets.90>
							<ControllerTargets.91 Id="__ID109__">
								<LockEnvelope Value="0" />
							</ControllerTargets.91>
							<ControllerTargets.92 Id="__ID110__">
								<LockEnvelope Value="0" />
							</ControllerTargets.92>
							<ControllerTargets.93 Id="__ID111__">
								<LockEnvelope Value="0" />
							</ControllerTargets.93>
							<ControllerTargets.94 Id="__ID112__">
								<LockEnvelope Value="0" />
							</ControllerTargets.94>
							<ControllerTargets.95 Id="__ID113__">
								<LockEnvelope Value="0" />
							</ControllerTargets.95>
							<ControllerTargets.96 Id="__ID114__">
								<LockEnvelope Value="0" />
							</ControllerTargets.96>
							<ControllerTargets.97 Id="__ID115__">
								<LockEnvelope Value="0" />
							</ControllerTargets.97>
							<ControllerTargets.98 Id="__ID116__">
								<LockEnvelope Value="0" />
							</ControllerTargets.98>
							<ControllerTargets.99 Id="__ID117__">
								<LockEnvelope Value="0" />
							</ControllerTargets.99>
							<ControllerTargets.100 Id="__ID118__">
								<LockEnvelope Value="0" />
							</ControllerTargets.100>
							<ControllerTargets.101 Id="__ID119__">
								<LockEnvelope Value="0" />
							</ControllerTargets.101>
							<ControllerTargets.102 Id="__ID120__">
								<LockEnvelope Value="0" />
							</ControllerTargets.102>
							<ControllerTargets.103 Id="__ID121__">
								<LockEnvelope Value="0" />
							</ControllerTargets.103>
							<ControllerTargets.104 Id="__ID122__">
								<LockEnvelope Value="0" />
							</ControllerTargets.104>
							<ControllerTargets.105 Id="__ID123__">
								<LockEnvelope Value="0" />
							</ControllerTargets.105>
							<ControllerTargets.106 Id="__ID124__">
								<LockEnvelope Value="0" />
							</ControllerTargets.106>
							<ControllerTargets.107 Id="__ID125__">
								<LockEnvelope Value="0" />
							</ControllerTargets.107>
							<ControllerTargets.108 Id="__ID126__">
								<LockEnvelope Value="0" />
							</ControllerTargets.108>
							<ControllerTargets.109 Id="__ID127__">
								<LockEnvelope Value="0" />
							</ControllerTargets.109>
							<ControllerTargets.110 Id="__ID128__">
								<LockEnvelope Value="0" />
							</ControllerTargets.110>
							<ControllerTargets.111 Id="__ID129__">
								<LockEnvelope Value="0" />
							</ControllerTargets.111>
							<ControllerTargets.112 Id="__ID130__">
								<LockEnvelope Value="0" />
							</ControllerTargets.112>
							<ControllerTargets.113 Id="__ID131__">
								<LockEnvelope Value="0" />
							</ControllerTargets.113>
							<ControllerTargets.114 Id="__ID132__">
								<LockEnvelope Value="0" />
							</ControllerTargets.114>
							<ControllerTargets.115 Id="__ID133__">
								<LockEnvelope Value="0" />
							</ControllerTargets.115>
							<ControllerTargets.116 Id="__ID134__">
								<LockEnvelope Value="0" />
							</ControllerTargets.116>
							<ControllerTargets.117 Id="__ID135__">
								<LockEnvelope Value="0" />
							</ControllerTargets.117>
							<ControllerTargets.118 Id="__ID136__">
								<LockEnvelope Value="0" />
							</ControllerTargets.118>
							<ControllerTargets.119 Id="__ID137__">
								<LockEnvelope Value="0" />
							</ControllerTargets.119>
							<ControllerTargets.120 Id="__ID138__">
								<LockEnvelope Value="0" />
							</ControllerTargets.120>
							<ControllerTargets.121 Id="__ID139__">
								<LockEnvelope Value="0" />
							</ControllerTargets.121>
							<ControllerTargets.122 Id="__ID140__">
								<LockEnvelope Value="0" />
							</ControllerTargets.122>
							<ControllerTargets.123 Id="__ID141__">
								<LockEnvelope Value="0" />
							</ControllerTargets.123>
							<ControllerTargets.124 Id="__ID142__">
								<LockEnvelope Value="0" />
							</ControllerTargets.124>
							<ControllerTargets.125 Id="__ID143__">
								<LockEnvelope Value="0" />
							</ControllerTargets.125>
							<ControllerTargets.126 Id="__ID144__">
								<LockEnvelope Value="0" />
							</ControllerTargets.126>
							<ControllerTargets.127 Id="__ID145__">
								<LockEnvelope Value="0" />
							</ControllerTargets.127>
							<ControllerTargets.128 Id="__ID146__">
								<LockEnvelope Value="0" />
							</ControllerTargets.128>
							<ControllerTargets.129 Id="__ID147__">
								<LockEnvelope Value="0" />
							</ControllerTargets.129>
							<ControllerTargets.130 Id="__ID148__">
								<LockEnvelope Value="0" />
							</ControllerTargets.130>
						</MidiControllers>
					</MainSequencer>
					<FreezeSequencer>
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="__ID149__">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="__ID150__" />
						<LastSelectedTimeableIndex Value="0" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<ClipSlotList>
__CLIP_SLOT_LIST_FREEZE__
							</ClipSlotList>
						<MonitoringEnum Value="1" />
						<KeepRecordMonitoringLatency Value="true" />
						<Sample>
							<ArrangerAutomation>
								<Events />
								<AutomationTransformViewState>
									<IsTransformPending Value="false" />
									<TimeAndValueTransforms />
								</AutomationTransformViewState>
							</ArrangerAutomation>
						</Sample>
						<VolumeModulationTarget Id="__ID151__">
							<LockEnvelope Value="0" />
						</VolumeModulationTarget>
						<TranspositionModulationTarget Id="__ID152__">
							<LockEnvelope Value="0" />
						</TranspositionModulationTarget>
						<TransientEnvelopeModulationTarget Id="__ID153__">
							<LockEnvelope Value="0" />
						</TransientEnvelopeModulationTarget>
						<GrainSizeModulationTarget Id="__ID154__">
							<LockEnvelope Value="0" />
						</GrainSizeModulationTarget>
						<FluxModulationTarget Id="__ID155__">
							<LockEnvelope Value="0" />
						</FluxModulationTarget>
						<SampleOffsetModulationTarget Id="__ID156__">
							<LockEnvelope Value="0" />
						</SampleOffsetModulationTarget>
						<ComplexProFormantsModulationTarget Id="__ID157__">
							<LockEnvelope Value="0" />
						</ComplexProFormantsModulationTarget>
						<ComplexProEnvelopeModulationTarget Id="__ID158__">
							<LockEnvelope Value="0" />
						</ComplexProEnvelopeModulationTarget>
						<PitchViewScrollPosition Value="-1073741824" />
						<SampleOffsetModulationScrollPosition Value="-1073741824" />
						<Recorder>
							<IsArmed Value="false" />
							<TakeCounter Value="1" />
						</Recorder>
					</FreezeSequencer>
					<DeviceChain>
						<Devices>
__DEVICE__
						</Devices>
						<SignalModulations />
					</DeviceChain>
				</DeviceChain>
				<ReWireDeviceMidiTargetId Value="0" />
				<PitchbendRange Value="96" />
				<IsTuned Value="true" />
				<ControllerLayoutRemoteable Value="0" />
				<ControllerLayoutCustomization>
					<PitchClassSource Value="0" />
					<OctaveSource Value="2" />
					<KeyNoteTarget Value="60" />
					<StepSize Value="1" />
					<OctaveEvery Value="12" />
					<AllowedKeys Value="0" />
					<FillerKeysMapTo Value="0" />
				</ControllerLayoutCustomization>
			</MidiTrack>`;

// __NOTES_BLOCK__ = entire outer <Notes>...</Notes> element
const MIDI_CLIP_TPL = `										<MidiClip Id="0" Time="0">
											<LomId Value="0" />
											<LomIdView Value="0" />
											<CurrentStart Value="0" />
											<CurrentEnd Value="__CLIP_LEN__" />
											<Loop>
												<LoopStart Value="0" />
												<LoopEnd Value="__CLIP_LEN__" />
												<StartRelative Value="0" />
												<LoopOn Value="true" />
												<OutMarker Value="__CLIP_LEN__" />
												<HiddenLoopStart Value="0" />
												<HiddenLoopEnd Value="__CLIP_LEN__" />
											</Loop>
											<Name Value="__CLIP_NAME__" />
											<Annotation Value="" />
											<Color Value="4" />
											<LaunchMode Value="0" />
											<LaunchQuantisation Value="0" />
											<TimeSignature>
												<TimeSignatures>
													<RemoteableTimeSignature Id="0">
														<Numerator Value="4" />
														<Denominator Value="4" />
														<Time Value="0" />
													</RemoteableTimeSignature>
												</TimeSignatures>
											</TimeSignature>
											<Envelopes>
												<Envelopes />
											</Envelopes>
											<ScrollerTimePreserver>
												<LeftTime Value="0" />
												<RightTime Value="__CLIP_LEN__" />
											</ScrollerTimePreserver>
											<TimeSelection>
												<AnchorTime Value="0" />
												<OtherTime Value="__CLIP_LEN__" />
											</TimeSelection>
											<Legato Value="false" />
											<Ram Value="false" />
											<GrooveSettings>
												<GrooveId Value="-1" />
											</GrooveSettings>
											<Disabled Value="false" />
											<VelocityAmount Value="0" />
											<FollowAction>
												<FollowTime Value="__CLIP_LEN__" />
												<IsLinked Value="true" />
												<LoopIterations Value="1" />
												<FollowActionA Value="4" />
												<FollowActionB Value="0" />
												<FollowChanceA Value="100" />
												<FollowChanceB Value="0" />
												<JumpIndexA Value="1" />
												<JumpIndexB Value="1" />
												<FollowActionEnabled Value="false" />
											</FollowAction>
											<Grid>
												<FixedNumerator Value="1" />
												<FixedDenominator Value="16" />
												<GridIntervalPixel Value="20" />
												<Ntoles Value="2" />
												<SnapToGrid Value="true" />
												<Fixed Value="true" />
											</Grid>
											<FreezeStart Value="0" />
											<FreezeEnd Value="0" />
											<IsWarped Value="true" />
											<TakeId Value="1" />
											<IsInKey Value="true" />
											<ScaleInformation>
												<Root Value="0" />
												<Name Value="0" />
											</ScaleInformation>
											__NOTES_BLOCK__
											<BankSelectCoarse Value="-1" />
											<BankSelectFine Value="-1" />
											<ProgramChange Value="-1" />
											<NoteEditorFoldInZoom Value="-1" />
											<NoteEditorFoldInScroll Value="0" />
											<NoteEditorFoldOutZoom Value="2039" />
											<NoteEditorFoldOutScroll Value="-876" />
											<NoteEditorFoldScaleZoom Value="-1" />
											<NoteEditorFoldScaleScroll Value="0" />
											<NoteSpellingPreference Value="0" />
											<AccidentalSpellingPreference Value="3" />
											<PreferFlatRootNote Value="false" />
											<ExpressionGrid>
												<FixedNumerator Value="1" />
												<FixedDenominator Value="16" />
												<GridIntervalPixel Value="20" />
												<Ntoles Value="2" />
												<SnapToGrid Value="false" />
												<Fixed Value="false" />
											</ExpressionGrid>
										</MidiClip>`;

// OriginalSimpler template — placeholders:
//   __DID0__..__DID109__ = device automation IDs
//   __SAMPLE_NAME__, __SAMPLE_RELPATH__, __SAMPLE_ABS_PATH__
//   __SAMPLE_SIZE__, __SAMPLE_END__, __SAMPLE_RATE__
//   __PLAYBACK_MODE__  (1 = 1-Shot, 2 = Slice)
//   __SLICE_POINTS__   (SlicePoint elements, empty string for 1-Shot)
const SIMPLER_DEVICE_TPL = `							<OriginalSimpler Id="0">
								<LomId Value="0" />
								<LomIdView Value="0" />
								<IsExpanded Value="true" />
								<BreakoutIsExpanded Value="false" />
								<On>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="__DID0__">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</On>
								<ModulationSourceCount Value="0" />
								<ParametersListWrapper LomId="0" />
								<Pointee Id="__DID1__" />
								<LastSelectedTimeableIndex Value="0" />
								<LastSelectedClipEnvelopeIndex Value="0" />
								<LastPresetRef>
									<Value>
										<AbletonDefaultPresetRef Id="2">
											<FileRef>
												<RelativePathType Value="7" />
												<RelativePath Value="Devices/Instruments/Simpler" />
												<Path Value="/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/Builtin/Devices/Instruments/Simpler" />
												<Type Value="2" />
												<LivePackName Value="" />
												<LivePackId Value="" />
												<OriginalFileSize Value="0" />
												<OriginalCrc Value="0" />
												<SourceHint Value="" />
											</FileRef>
											<DeviceId Name="OriginalSimpler" />
										</AbletonDefaultPresetRef>
									</Value>
								</LastPresetRef>
								<LockedScripts />
								<IsFolded Value="false" />
								<ShouldShowPresetName Value="true" />
								<UserName Value="" />
								<Annotation Value="" />
								<SourceContext>
									<Value>
										<BranchSourceContext Id="0">
											<OriginalFileRef>
												<FileRef Id="0">
													<RelativePathType Value="7" />
													<RelativePath Value="Devices/Instruments/Simpler" />
													<Path Value="/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/Builtin/Devices/Instruments/Simpler" />
													<Type Value="2" />
													<LivePackName Value="" />
													<LivePackId Value="" />
													<OriginalFileSize Value="0" />
													<OriginalCrc Value="0" />
													<SourceHint Value="" />
												</FileRef>
											</OriginalFileRef>
											<BrowserContentPath Value="view:X-Synths#Simpler" />
											<LocalFiltersJson Value="" />
											<PresetRef>
												<AbletonDefaultPresetRef Id="0">
													<FileRef>
														<RelativePathType Value="7" />
														<RelativePath Value="Devices/Instruments/Simpler" />
														<Path Value="/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/Builtin/Devices/Instruments/Simpler" />
														<Type Value="2" />
														<LivePackName Value="" />
														<LivePackId Value="" />
														<OriginalFileSize Value="0" />
														<OriginalCrc Value="0" />
														<SourceHint Value="" />
													</FileRef>
													<DeviceId Name="OriginalSimpler" />
												</AbletonDefaultPresetRef>
											</PresetRef>
											<BranchDeviceId Value="device:ableton:instr:OriginalSimpler" />
										</BranchSourceContext>
									</Value>
								</SourceContext>
								<MpePitchBendUsesTuning Value="true" />
								<ViewData Value="{}" />
								<OverwriteProtectionNumber Value="3075" />
								<Player>
									<MultiSampleMap>
										<SampleParts>
											<MultiSamplePart Id="0" InitUpdateAreSlicesFromOnsetsEditableAfterRead="false" HasImportedSlicePoints="true" NeedsAnalysisData="true">
												<LomId Value="0" />
												<Name Value="__SAMPLE_NAME__" />
												<Selection Value="true" />
												<IsActive Value="true" />
												<Solo Value="false" />
												<KeyRange>
													<Min Value="0" />
													<Max Value="127" />
													<CrossfadeMin Value="0" />
													<CrossfadeMax Value="127" />
												</KeyRange>
												<VelocityRange>
													<Min Value="1" />
													<Max Value="127" />
													<CrossfadeMin Value="1" />
													<CrossfadeMax Value="127" />
												</VelocityRange>
												<SelectorRange>
													<Min Value="0" />
													<Max Value="127" />
													<CrossfadeMin Value="0" />
													<CrossfadeMax Value="127" />
												</SelectorRange>
												<RootKey Value="60" />
												<Detune Value="0" />
												<TuneScale Value="100" />
												<Panorama Value="0" />
												<Volume Value="1" />
												<Link Value="false" />
												<SampleStart Value="0" />
												<SampleEnd Value="__SAMPLE_END__" />
												<SustainLoop>
													<Start Value="0" />
													<End Value="335999" />
													<Mode Value="0" />
													<Crossfade Value="0" />
													<Detune Value="0" />
												</SustainLoop>
												<ReleaseLoop>
													<Start Value="0" />
													<End Value="335999" />
													<Mode Value="3" />
													<Crossfade Value="0" />
													<Detune Value="0" />
												</ReleaseLoop>
												<SampleRef>
													<FileRef>
														<RelativePathType Value="1" />
														<RelativePath Value="__SAMPLE_RELPATH__" />
														<Path Value="__SAMPLE_ABS_PATH__" />
														<Type Value="2" />
														<LivePackName Value="" />
														<LivePackId Value="" />
														<OriginalFileSize Value="__SAMPLE_SIZE__" />
														<OriginalCrc Value="29116" />
														<SourceHint Value="" />
													</FileRef>
													<LastModDate Value="1764990226" />
													<SourceContext>
														<SourceContext Id="0">
															<OriginalFileRef>
																<FileRef Id="0">
																	<RelativePathType Value="1" />
																	<RelativePath Value="__SAMPLE_RELPATH__" />
																	<Path Value="__SAMPLE_ABS_PATH__" />
																	<Type Value="2" />
																	<LivePackName Value="" />
																	<LivePackId Value="" />
																	<OriginalFileSize Value="__SAMPLE_SIZE__" />
																	<OriginalCrc Value="29116" />
																	<SourceHint Value="" />
																</FileRef>
															</OriginalFileRef>
															<BrowserContentPath Value="" />
															<LocalFiltersJson Value="" />
														</SourceContext>
													</SourceContext>
													<SampleUsageHint Value="0" />
													<DefaultDuration Value="336000" />
													<DefaultSampleRate Value="__SAMPLE_RATE__" />
													<SamplesToAutoWarp Value="1" />
												</SampleRef>
												<SlicingThreshold Value="100" />
												<SlicingBeatGrid Value="4" />
												<SlicingRegions Value="8" />
												<SlicingStyle Value="0" />
												<SampleWarpProperties>
													<WarpMarkers>
														<WarpMarker Id="0" SecTime="0" BeatTime="0" />
														<WarpMarker Id="1" SecTime="7.6190476190476186" BeatTime="16" />
														<WarpMarker Id="2" SecTime="7.6339285714285712" BeatTime="16.03125" />
													</WarpMarkers>
													<WarpMode Value="0" />
													<GranularityTones Value="30" />
													<GranularityTexture Value="65" />
													<FluctuationTexture Value="25" />
													<ComplexProFormants Value="100" />
													<ComplexProEnvelope Value="128" />
													<TransientResolution Value="6" />
													<TransientLoopMode Value="2" />
													<TransientEnvelope Value="100" />
													<IsWarped Value="false" />
													<Onsets>
														<UserOnsets />
														<HasUserOnsets Value="false" />
													</Onsets>
													<TimeSignature>
														<TimeSignatures>
															<RemoteableTimeSignature Id="0">
																<Numerator Value="4" />
																<Denominator Value="4" />
																<Time Value="0" />
															</RemoteableTimeSignature>
														</TimeSignatures>
													</TimeSignature>
													<BeatGrid>
														<FixedNumerator Value="1" />
														<FixedDenominator Value="16" />
														<GridIntervalPixel Value="20" />
														<Ntoles Value="2" />
														<SnapToGrid Value="true" />
														<Fixed Value="false" />
													</BeatGrid>
												</SampleWarpProperties>
												<InitialSlicePointsFromOnsets>__SLICE_POINTS__</InitialSlicePointsFromOnsets>
												<SlicePoints />
												<ManualSlicePoints />
												<BeatSlicePoints />
												<RegionSlicePoints />
												<UseDynamicBeatSlices Value="true" />
												<UseDynamicRegionSlices Value="true" />
												<AreSlicesFromOnsetsEditable Value="false" />
											</MultiSamplePart>
										</SampleParts>
										<LoadInRam Value="false" />
										<LayerCrossfade Value="0" />
										<SourceContext />
										<RoundRobin Value="false" />
										<RoundRobinMode Value="0" />
										<RoundRobinResetPeriod Value="0" />
										<RoundRobinRandomSeed Value="-62278830" />
									</MultiSampleMap>
									<LoopModulators>
										<IsModulated Value="true" />
										<SampleStart>
											<LomId Value="0" />
											<Manual Value="0" />
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID2__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22325">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</SampleStart>
										<SampleLength>
											<LomId Value="0" />
											<Manual Value="1" />
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID3__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22327">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</SampleLength>
										<LoopOn>
											<LomId Value="0" />
											<Manual Value="false" />
											<AutomationTarget Id="__DID4__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<MidiCCOnOffThresholds>
												<Min Value="64" />
												<Max Value="127" />
											</MidiCCOnOffThresholds>
										</LoopOn>
										<LoopLength>
											<LomId Value="0" />
											<Manual Value="1" />
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID5__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22330">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</LoopLength>
										<LoopFade>
											<LomId Value="0" />
											<Manual Value="0" />
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID6__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22332">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</LoopFade>
									</LoopModulators>
									<Reverse>
										<LomId Value="0" />
										<Manual Value="false" />
										<AutomationTarget Id="__DID7__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</Reverse>
									<Snap>
										<LomId Value="0" />
										<Manual Value="true" />
										<AutomationTarget Id="__DID8__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</Snap>
									<SampleSelector>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="127" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID9__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22336">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</SampleSelector>
									<SubOsc>
										<IsOn>
											<LomId Value="0" />
											<Manual Value="false" />
											<AutomationTarget Id="__DID10__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<MidiCCOnOffThresholds>
												<Min Value="64" />
												<Max Value="127" />
											</MidiCCOnOffThresholds>
										</IsOn>
										<Slot>
											<Value />
										</Slot>
									</SubOsc>
									<InterpolationMode Value="3" />
									<UseConstPowCrossfade Value="true" />
								</Player>
								<Pitch>
									<TransposeKey>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="-48" />
											<Max Value="48" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID11__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22339">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</TransposeKey>
									<TransposeFine>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="-50" />
											<Max Value="50" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID12__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22341">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</TransposeFine>
									<PitchLfoAmount>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID13__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22343">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</PitchLfoAmount>
									<Envelope>
										<IsOn>
											<LomId Value="0" />
											<Manual Value="true" />
											<AutomationTarget Id="__DID14__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<MidiCCOnOffThresholds>
												<Min Value="64" />
												<Max Value="127" />
											</MidiCCOnOffThresholds>
										</IsOn>
										<Slot>
											<Value>
												<SimplerPitchEnvelope Id="0">
													<AttackTime>
														<LomId Value="0" />
														<Manual Value="0.1000000015" />
														<MidiControllerRange>
															<Min Value="0.1000000015" />
															<Max Value="20000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID15__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22412">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</AttackTime>
													<AttackLevel>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID16__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22414">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</AttackLevel>
													<AttackSlope>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID17__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22416">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</AttackSlope>
													<DecayTime>
														<LomId Value="0" />
														<Manual Value="599.999878" />
														<MidiControllerRange>
															<Min Value="1" />
															<Max Value="60000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID18__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22418">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</DecayTime>
													<DecayLevel>
														<LomId Value="0" />
														<Manual Value="1" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID19__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22420">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</DecayLevel>
													<DecaySlope>
														<LomId Value="0" />
														<Manual Value="1" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID20__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22422">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</DecaySlope>
													<SustainLevel>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID21__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22424">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</SustainLevel>
													<ReleaseTime>
														<LomId Value="0" />
														<Manual Value="50.0000038" />
														<MidiControllerRange>
															<Min Value="1" />
															<Max Value="60000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID22__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22426">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</ReleaseTime>
													<ReleaseLevel>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID23__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22428">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</ReleaseLevel>
													<ReleaseSlope>
														<LomId Value="0" />
														<Manual Value="1" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID24__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22430">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</ReleaseSlope>
													<LoopMode>
														<LomId Value="0" />
														<Manual Value="0" />
														<AutomationTarget Id="__DID25__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="4" />
														</MidiControllerRange>
													</LoopMode>
													<LoopTime>
														<LomId Value="0" />
														<Manual Value="100.000031" />
														<MidiControllerRange>
															<Min Value="0.200000003" />
															<Max Value="20000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID26__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22433">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</LoopTime>
													<RepeatTime>
														<LomId Value="0" />
														<Manual Value="3" />
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="14" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID27__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22435">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</RepeatTime>
													<TimeVelScale>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-100" />
															<Max Value="100" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID28__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22437">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</TimeVelScale>
													<CurrentOverlay Value="0" />
													<Amount>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-48" />
															<Max Value="48" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID29__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22439">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</Amount>
													<ScrollPosition Value="0" />
												</SimplerPitchEnvelope>
											</Value>
										</Slot>
									</Envelope>
									<ScrollPosition Value="-1073741824" />
								</Pitch>
								<Filter>
									<IsOn>
										<LomId Value="0" />
										<Manual Value="true" />
										<AutomationTarget Id="__DID30__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</IsOn>
									<Slot>
										<Value>
											<SimplerFilter Id="0">
												<LegacyType>
													<LomId Value="0" />
													<Manual Value="0" />
													<AutomationTarget Id="__DID31__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="5" />
													</MidiControllerRange>
												</LegacyType>
												<Type>
													<LomId Value="0" />
													<Manual Value="0" />
													<AutomationTarget Id="__DID32__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="4" />
													</MidiControllerRange>
												</Type>
												<CircuitLpHp>
													<LomId Value="0" />
													<Manual Value="0" />
													<AutomationTarget Id="__DID33__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="4" />
													</MidiControllerRange>
												</CircuitLpHp>
												<CircuitBpNoMo>
													<LomId Value="0" />
													<Manual Value="0" />
													<AutomationTarget Id="__DID34__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
												</CircuitBpNoMo>
												<Slope>
													<LomId Value="0" />
													<Manual Value="true" />
													<AutomationTarget Id="__DID35__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiCCOnOffThresholds>
														<Min Value="64" />
														<Max Value="127" />
													</MidiCCOnOffThresholds>
												</Slope>
												<Freq>
													<LomId Value="0" />
													<Manual Value="22000" />
													<MidiControllerRange>
														<Min Value="30" />
														<Max Value="22000" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID36__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22446">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Freq>
												<LegacyQ>
													<LomId Value="0" />
													<Manual Value="0.6999999881" />
													<MidiControllerRange>
														<Min Value="0.3000000119" />
														<Max Value="10" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID37__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22448">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</LegacyQ>
												<Res>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1.25" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID38__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22450">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Res>
												<X>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID39__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22452">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</X>
												<Drive>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="24" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID40__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22454">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Drive>
												<Envelope>
													<AttackTime>
														<LomId Value="0" />
														<Manual Value="0.1000000015" />
														<MidiControllerRange>
															<Min Value="0.1000000015" />
															<Max Value="20000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID41__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22456">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</AttackTime>
													<AttackLevel>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID42__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22458">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</AttackLevel>
													<AttackSlope>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID43__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22460">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</AttackSlope>
													<DecayTime>
														<LomId Value="0" />
														<Manual Value="599.999878" />
														<MidiControllerRange>
															<Min Value="1" />
															<Max Value="60000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID44__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22462">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</DecayTime>
													<DecayLevel>
														<LomId Value="0" />
														<Manual Value="1" />
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID45__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22464">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</DecayLevel>
													<DecaySlope>
														<LomId Value="0" />
														<Manual Value="1" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID46__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22466">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</DecaySlope>
													<SustainLevel>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID47__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22468">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</SustainLevel>
													<ReleaseTime>
														<LomId Value="0" />
														<Manual Value="50.0000038" />
														<MidiControllerRange>
															<Min Value="1" />
															<Max Value="60000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID48__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22470">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</ReleaseTime>
													<ReleaseLevel>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID49__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22472">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</ReleaseLevel>
													<ReleaseSlope>
														<LomId Value="0" />
														<Manual Value="1" />
														<MidiControllerRange>
															<Min Value="-1" />
															<Max Value="1" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID50__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22474">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</ReleaseSlope>
													<LoopMode>
														<LomId Value="0" />
														<Manual Value="0" />
														<AutomationTarget Id="__DID51__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="4" />
														</MidiControllerRange>
													</LoopMode>
													<LoopTime>
														<LomId Value="0" />
														<Manual Value="100.000031" />
														<MidiControllerRange>
															<Min Value="0.200000003" />
															<Max Value="20000" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID52__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22477">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</LoopTime>
													<RepeatTime>
														<LomId Value="0" />
														<Manual Value="3" />
														<MidiControllerRange>
															<Min Value="0" />
															<Max Value="14" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID53__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22479">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</RepeatTime>
													<TimeVelScale>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-100" />
															<Max Value="100" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID54__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22481">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</TimeVelScale>
													<CurrentOverlay Value="0" />
													<IsOn>
														<LomId Value="0" />
														<Manual Value="true" />
														<AutomationTarget Id="__DID55__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<MidiCCOnOffThresholds>
															<Min Value="64" />
															<Max Value="127" />
														</MidiCCOnOffThresholds>
													</IsOn>
													<Amount>
														<LomId Value="0" />
														<Manual Value="0" />
														<MidiControllerRange>
															<Min Value="-72" />
															<Max Value="72" />
														</MidiControllerRange>
														<AutomationTarget Id="__DID56__">
															<LockEnvelope Value="0" />
														</AutomationTarget>
														<ModulationTarget Id="22484">
															<LockEnvelope Value="0" />
														</ModulationTarget>
													</Amount>
													<ScrollPosition Value="0" />
												</Envelope>
												<ModByPitch>
													<LomId Value="0" />
													<Manual Value="1" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID57__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22486">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</ModByPitch>
												<ModByVelocity>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID58__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22488">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</ModByVelocity>
												<ModByLfo>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="24" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID59__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22490">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</ModByLfo>
											</SimplerFilter>
										</Value>
									</Slot>
								</Filter>
								<Shaper>
									<IsOn>
										<LomId Value="0" />
										<Manual Value="false" />
										<AutomationTarget Id="__DID60__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</IsOn>
									<Slot>
										<Value />
									</Slot>
								</Shaper>
								<VolumeAndPan>
									<Volume>
										<LomId Value="0" />
										<Manual Value="-12" />
										<MidiControllerRange>
											<Min Value="-36" />
											<Max Value="36" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID61__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22348">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</Volume>
									<VolumeVelScale>
										<LomId Value="0" />
										<Manual Value="0.349999994" />
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID62__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22350">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</VolumeVelScale>
									<VolumeKeyScale>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="-1" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID63__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22352">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</VolumeKeyScale>
									<VolumeLfoAmount>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID64__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22354">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</VolumeLfoAmount>
									<Panorama>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="-1" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID65__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22356">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</Panorama>
									<PanoramaKeyScale>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="-1" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID66__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22358">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</PanoramaKeyScale>
									<PanoramaRnd>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID67__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22360">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</PanoramaRnd>
									<PanoramaLfoAmount>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="1" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID68__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22362">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</PanoramaLfoAmount>
									<Envelope>
										<AttackTime>
											<LomId Value="0" />
											<Manual Value="0.1000000015" />
											<MidiControllerRange>
												<Min Value="0.1000000015" />
												<Max Value="20000" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID69__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22364">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</AttackTime>
										<AttackLevel>
											<LomId Value="0" />
											<Manual Value="0.0003162277571" />
											<MidiControllerRange>
												<Min Value="0.0003162277571" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID70__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22366">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</AttackLevel>
										<AttackSlope>
											<LomId Value="0" />
											<Manual Value="0" />
											<MidiControllerRange>
												<Min Value="-1" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID71__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22368">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</AttackSlope>
										<DecayTime>
											<LomId Value="0" />
											<Manual Value="599.999878" />
											<MidiControllerRange>
												<Min Value="1" />
												<Max Value="60000" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID72__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22370">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</DecayTime>
										<DecayLevel>
											<LomId Value="0" />
											<Manual Value="1" />
											<MidiControllerRange>
												<Min Value="0.0003162277571" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID73__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22372">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</DecayLevel>
										<DecaySlope>
											<LomId Value="0" />
											<Manual Value="1" />
											<MidiControllerRange>
												<Min Value="-1" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID74__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22374">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</DecaySlope>
										<SustainLevel>
											<LomId Value="0" />
											<Manual Value="1" />
											<MidiControllerRange>
												<Min Value="0.0003162277571" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID75__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22376">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</SustainLevel>
										<ReleaseTime>
											<LomId Value="0" />
											<Manual Value="50.0000038" />
											<MidiControllerRange>
												<Min Value="1" />
												<Max Value="60000" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID76__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22378">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</ReleaseTime>
										<ReleaseLevel>
											<LomId Value="0" />
											<Manual Value="0.0003162277571" />
											<MidiControllerRange>
												<Min Value="0.0003162277571" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID77__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22380">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</ReleaseLevel>
										<ReleaseSlope>
											<LomId Value="0" />
											<Manual Value="1" />
											<MidiControllerRange>
												<Min Value="-1" />
												<Max Value="1" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID78__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22382">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</ReleaseSlope>
										<LoopMode>
											<LomId Value="0" />
											<Manual Value="0" />
											<AutomationTarget Id="__DID79__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="4" />
											</MidiControllerRange>
										</LoopMode>
										<LoopTime>
											<LomId Value="0" />
											<Manual Value="100.000031" />
											<MidiControllerRange>
												<Min Value="0.200000003" />
												<Max Value="20000" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID80__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22385">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</LoopTime>
										<RepeatTime>
											<LomId Value="0" />
											<Manual Value="3" />
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="14" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID81__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22387">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</RepeatTime>
										<TimeVelScale>
											<LomId Value="0" />
											<Manual Value="0" />
											<MidiControllerRange>
												<Min Value="-100" />
												<Max Value="100" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID82__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22389">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</TimeVelScale>
										<CurrentOverlay Value="0" />
									</Envelope>
									<OneShotEnvelope>
										<FadeInTime>
											<LomId Value="0" />
											<Manual Value="0.1000000089" />
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="2000" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID83__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22391">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</FadeInTime>
										<SustainMode>
											<LomId Value="0" />
											<Manual Value="0" />
											<AutomationTarget Id="__DID84__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="1" />
											</MidiControllerRange>
										</SustainMode>
										<FadeOutTime>
											<LomId Value="0" />
											<Manual Value="0.1000000089" />
											<MidiControllerRange>
												<Min Value="0" />
												<Max Value="2000" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID85__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22394">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</FadeOutTime>
									</OneShotEnvelope>
								</VolumeAndPan>
								<AuxEnv>
									<IsOn>
										<LomId Value="0" />
										<Manual Value="false" />
										<AutomationTarget Id="__DID86__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</IsOn>
									<Slot>
										<Value />
									</Slot>
								</AuxEnv>
								<Lfo>
									<IsOn>
										<LomId Value="0" />
										<Manual Value="true" />
										<AutomationTarget Id="__DID87__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</IsOn>
									<Slot>
										<Value>
											<SimplerLfo Id="0">
												<Type>
													<LomId Value="0" />
													<Manual Value="0" />
													<AutomationTarget Id="__DID88__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="5" />
													</MidiControllerRange>
												</Type>
												<Frequency>
													<LomId Value="0" />
													<Manual Value="1" />
													<MidiControllerRange>
														<Min Value="0.009999999776" />
														<Max Value="30" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID89__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22493">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Frequency>
												<RateType>
													<LomId Value="0" />
													<Manual Value="0" />
													<AutomationTarget Id="__DID90__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
												</RateType>
												<BeatRate>
													<LomId Value="0" />
													<Manual Value="4" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="21" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID91__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22496">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</BeatRate>
												<StereoMode>
													<LomId Value="0" />
													<Manual Value="0" />
													<AutomationTarget Id="__DID92__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
												</StereoMode>
												<Spin>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="0.5" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID93__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22499">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Spin>
												<Phase>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="360" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID94__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22501">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Phase>
												<Offset>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="360" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID95__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22503">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Offset>
												<FrequencyKeyScale>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID96__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22505">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</FrequencyKeyScale>
												<Smooth>
													<LomId Value="0" />
													<Manual Value="0.5" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID97__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22507">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Smooth>
												<Attack>
													<LomId Value="0" />
													<Manual Value="0.1000000015" />
													<MidiControllerRange>
														<Min Value="0.1000000015" />
														<Max Value="20000" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID98__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22509">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Attack>
												<Retrigger>
													<LomId Value="0" />
													<Manual Value="true" />
													<AutomationTarget Id="__DID99__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<MidiCCOnOffThresholds>
														<Min Value="64" />
														<Max Value="127" />
													</MidiCCOnOffThresholds>
												</Retrigger>
												<Width>
													<LomId Value="0" />
													<Manual Value="0" />
													<MidiControllerRange>
														<Min Value="0" />
														<Max Value="1" />
													</MidiControllerRange>
													<AutomationTarget Id="__DID100__">
														<LockEnvelope Value="0" />
													</AutomationTarget>
													<ModulationTarget Id="22512">
														<LockEnvelope Value="0" />
													</ModulationTarget>
												</Width>
											</SimplerLfo>
										</Value>
									</Slot>
								</Lfo>
								<AuxLfos.0>
									<IsOn>
										<LomId Value="0" />
										<Manual Value="false" />
										<AutomationTarget Id="__DID101__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</IsOn>
									<Slot>
										<Value />
									</Slot>
								</AuxLfos.0>
								<AuxLfos.1>
									<IsOn>
										<LomId Value="0" />
										<Manual Value="false" />
										<AutomationTarget Id="__DID102__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiCCOnOffThresholds>
											<Min Value="64" />
											<Max Value="127" />
										</MidiCCOnOffThresholds>
									</IsOn>
									<Slot>
										<Value />
									</Slot>
								</AuxLfos.1>
								<KeyDst>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
								</KeyDst>
								<VelDst>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
								</VelDst>
								<RelVelDst>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
								</RelVelDst>
								<MidiCtrl.0>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
									<Feedback Value="0" />
								</MidiCtrl.0>
								<MidiCtrl.1>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
									<Feedback Value="0" />
								</MidiCtrl.1>
								<MidiCtrl.2>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
									<Feedback Value="0" />
								</MidiCtrl.2>
								<MidiCtrl.3>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
									<Feedback Value="0" />
								</MidiCtrl.3>
								<MidiCtrl.4>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
									<Feedback Value="0" />
								</MidiCtrl.4>
								<MidiCtrl.5>
									<ModConnections.0>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.0>
									<ModConnections.1>
										<Amount Value="0" />
										<Connection Value="0" />
									</ModConnections.1>
									<Feedback Value="0" />
								</MidiCtrl.5>
								<Globals>
									<NumVoices Value="5" />
									<NumVoicesEnvTimeControl Value="false" />
									<RetriggerMode Value="true" />
									<ModulationResolution Value="2" />
									<SpreadAmount>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="100" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID103__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22400">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</SpreadAmount>
									<KeyZoneShift>
										<LomId Value="0" />
										<Manual Value="0" />
										<MidiControllerRange>
											<Min Value="-48" />
											<Max Value="48" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID104__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22402">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</KeyZoneShift>
									<PortamentoMode>
										<LomId Value="0" />
										<Manual Value="0" />
										<AutomationTarget Id="__DID105__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<MidiControllerRange>
											<Min Value="0" />
											<Max Value="2" />
										</MidiControllerRange>
									</PortamentoMode>
									<PortamentoTime>
										<LomId Value="0" />
										<Manual Value="50.0000153" />
										<MidiControllerRange>
											<Min Value="0.1000000015" />
											<Max Value="10000" />
										</MidiControllerRange>
										<AutomationTarget Id="__DID106__">
											<LockEnvelope Value="0" />
										</AutomationTarget>
										<ModulationTarget Id="22405">
											<LockEnvelope Value="0" />
										</ModulationTarget>
									</PortamentoTime>
									<PitchBendRange Value="5" />
									<MpePitchBendRange Value="48" />
									<ScrollPosition Value="0" />
									<EnvScale>
										<EnvTime>
											<LomId Value="0" />
											<Manual Value="0" />
											<MidiControllerRange>
												<Min Value="-100" />
												<Max Value="100" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID107__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22407">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</EnvTime>
										<EnvTimeKeyScale>
											<LomId Value="0" />
											<Manual Value="0" />
											<MidiControllerRange>
												<Min Value="-100" />
												<Max Value="100" />
											</MidiControllerRange>
											<AutomationTarget Id="__DID108__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<ModulationTarget Id="22409">
												<LockEnvelope Value="0" />
											</ModulationTarget>
										</EnvTimeKeyScale>
										<EnvTimeIncludeAttack>
											<LomId Value="0" />
											<Manual Value="true" />
											<AutomationTarget Id="__DID109__">
												<LockEnvelope Value="0" />
											</AutomationTarget>
											<MidiCCOnOffThresholds>
												<Min Value="64" />
												<Max Value="127" />
											</MidiCCOnOffThresholds>
										</EnvTimeIncludeAttack>
									</EnvScale>
									<IsSimpler Value="true" />
									<PlaybackMode Value="__PLAYBACK_MODE__" />
									<LegacyMode Value="false" />
								</Globals>
								<ViewSettings>
									<SelectedPage Value="0" />
									<ZoneEditorVisible Value="false" />
									<Seconds Value="false" />
									<SelectedSampleChannel Value="0" />
									<VerticalSampleZoom Value="1" />
									<IsAutoSelectEnabled Value="false" />
									<SimplerBreakoutVisible Value="false" />
								</ViewSettings>
								<SimplerSlicing>
									<PlaybackMode Value="0" />
								</SimplerSlicing>
							</OriginalSimpler>`;

const MAIN_TRACK_TPL = `		<MainTrack SelectedToolPanel="0" SelectedTransformationName="" SelectedGeneratorName="">
			<LomId Value="0" />
			<LomIdView Value="0" />
			<IsContentSelectedInDocument Value="false" />
			<PreferredContentViewMode Value="0" />
			<TrackDelay>
				<Value Value="0" />
				<IsValueSampleBased Value="false" />
			</TrackDelay>
			<Name>
				<EffectiveName Value="Main" />
				<UserName Value="" />
				<Annotation Value="" />
				<MemorizedFirstClipName Value="" />
			</Name>
			<Color Value="16" />
			<AutomationEnvelopes>
				<Envelopes>
					<AutomationEnvelope Id="0">
						<EnvelopeTarget>
							<PointeeId Value="10" />
						</EnvelopeTarget>
						<Automation>
							<Events>
								<EnumEvent Id="0" Time="-63072000" Value="201" />
							</Events>
							<AutomationTransformViewState>
								<IsTransformPending Value="false" />
								<TimeAndValueTransforms />
							</AutomationTransformViewState>
						</Automation>
					</AutomationEnvelope>
					<AutomationEnvelope Id="1">
						<EnvelopeTarget>
							<PointeeId Value="8" />
						</EnvelopeTarget>
						<Automation>
							<Events>
								<FloatEvent Id="0" Time="-63072000" Value="120" />
							</Events>
							<AutomationTransformViewState>
								<IsTransformPending Value="false" />
								<TimeAndValueTransforms />
							</AutomationTransformViewState>
						</Automation>
					</AutomationEnvelope>
				</Envelopes>
			</AutomationEnvelopes>
			<TrackGroupId Value="-1" />
			<TrackUnfolded Value="false" />
			<DevicesListWrapper LomId="0" />
			<ClipSlotsListWrapper LomId="0" />
			<ArrangementClipsListWrapper LomId="0" />
			<TakeLanesListWrapper LomId="0" />
			<ViewData Value="{}" />
			<TakeLanes>
				<TakeLanes />
				<AreTakeLanesFolded Value="true" />
			</TakeLanes>
			<LinkedTrackGroupId Value="-1" />
			<DeviceChain>
				<AutomationLanes>
					<AutomationLanes>
						<AutomationLane Id="0">
							<SelectedDevice Value="1" />
							<SelectedEnvelope Value="2" />
							<IsContentSelectedInDocument Value="false" />
							<LaneHeight Value="85" />
						</AutomationLane>
					</AutomationLanes>
					<AreAdditionalAutomationLanesFolded Value="false" />
				</AutomationLanes>
				<ClipEnvelopeChooserViewState>
					<SelectedDevice Value="0" />
					<SelectedEnvelope Value="0" />
					<PreferModulationVisible Value="false" />
				</ClipEnvelopeChooserViewState>
				<AudioInputRouting>
					<Target Value="AudioIn/External/S0" />
					<UpperDisplayString Value="Ext. In" />
					<LowerDisplayString Value="1/2" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</AudioInputRouting>
				<MidiInputRouting>
					<Target Value="MidiIn/External.All/-1" />
					<UpperDisplayString Value="Ext: All Ins" />
					<LowerDisplayString Value="" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</MidiInputRouting>
				<AudioOutputRouting>
					<Target Value="AudioOut/External/S0" />
					<UpperDisplayString Value="Ext. Out" />
					<LowerDisplayString Value="1/2" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</AudioOutputRouting>
				<MidiOutputRouting>
					<Target Value="MidiOut/None" />
					<UpperDisplayString Value="None" />
					<LowerDisplayString Value="" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</MidiOutputRouting>
				<Mixer>
					<LomId Value="0" />
					<LomIdView Value="0" />
					<IsExpanded Value="true" />
					<BreakoutIsExpanded Value="false" />
					<On>
						<LomId Value="0" />
						<Manual Value="true" />
						<AutomationTarget Id="1">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<MidiCCOnOffThresholds>
							<Min Value="64" />
							<Max Value="127" />
						</MidiCCOnOffThresholds>
					</On>
					<ModulationSourceCount Value="0" />
					<ParametersListWrapper LomId="0" />
					<Pointee Id="19730" />
					<LastSelectedTimeableIndex Value="2" />
					<LastSelectedClipEnvelopeIndex Value="0" />
					<LastPresetRef>
						<Value />
					</LastPresetRef>
					<LockedScripts />
					<IsFolded Value="false" />
					<ShouldShowPresetName Value="false" />
					<UserName Value="" />
					<Annotation Value="" />
					<SourceContext>
						<Value />
					</SourceContext>
					<MpePitchBendUsesTuning Value="true" />
					<ViewData Value="{}" />
					<Sends />
					<Speaker>
						<LomId Value="0" />
						<Manual Value="true" />
						<AutomationTarget Id="2">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<MidiCCOnOffThresholds>
							<Min Value="64" />
							<Max Value="127" />
						</MidiCCOnOffThresholds>
					</Speaker>
					<SoloSink Value="false" />
					<PanMode Value="0" />
					<Pan>
						<LomId Value="0" />
						<Manual Value="0" />
						<MidiControllerRange>
							<Min Value="-1" />
							<Max Value="1" />
						</MidiControllerRange>
						<AutomationTarget Id="3">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="4">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</Pan>
					<SplitStereoPanL>
						<LomId Value="0" />
						<Manual Value="-1" />
						<MidiControllerRange>
							<Min Value="-1" />
							<Max Value="1" />
						</MidiControllerRange>
						<AutomationTarget Id="16175">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="16176">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</SplitStereoPanL>
					<SplitStereoPanR>
						<LomId Value="0" />
						<Manual Value="1" />
						<MidiControllerRange>
							<Min Value="-1" />
							<Max Value="1" />
						</MidiControllerRange>
						<AutomationTarget Id="16177">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="16178">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</SplitStereoPanR>
					<Volume>
						<LomId Value="0" />
						<Manual Value="1.84382105" />
						<MidiControllerRange>
							<Min Value="0.0003162277571" />
							<Max Value="1.99526238" />
						</MidiControllerRange>
						<AutomationTarget Id="5">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="6">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</Volume>
					<ViewStateSessionTrackWidth Value="103" />
					<CrossFadeState>
						<LomId Value="0" />
						<Manual Value="1" />
						<AutomationTarget Id="7">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<MidiControllerRange>
							<Min Value="0" />
							<Max Value="2" />
						</MidiControllerRange>
					</CrossFadeState>
					<SendsListWrapper LomId="0" />
					<Tempo>
						<LomId Value="0" />
						<Manual Value="__BPM__" />
						<MidiControllerRange>
							<Min Value="60" />
							<Max Value="200" />
						</MidiControllerRange>
						<AutomationTarget Id="8">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="9">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</Tempo>
					<TimeSignature>
						<LomId Value="0" />
						<Manual Value="201" />
						<AutomationTarget Id="10">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<MidiControllerRange>
							<Min Value="0" />
							<Max Value="494" />
						</MidiControllerRange>
					</TimeSignature>
					<GlobalGrooveAmount>
						<LomId Value="0" />
						<Manual Value="0" />
						<MidiControllerRange>
							<Min Value="0" />
							<Max Value="131.25" />
						</MidiControllerRange>
						<AutomationTarget Id="11">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="12">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</GlobalGrooveAmount>
					<CrossFade>
						<LomId Value="0" />
						<Manual Value="0" />
						<MidiControllerRange>
							<Min Value="-1" />
							<Max Value="1" />
						</MidiControllerRange>
						<AutomationTarget Id="13">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="14">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</CrossFade>
					<TempoAutomationViewBottom Value="60" />
					<TempoAutomationViewTop Value="200" />
				</Mixer>
				<FreezeSequencer>
					<AudioSequencer Id="0">
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="15">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="19731" />
						<LastSelectedTimeableIndex Value="0" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<ClipSlotList>
__MAIN_TRACK_SLOTS__
							</ClipSlotList>
						<MonitoringEnum Value="1" />
						<KeepRecordMonitoringLatency Value="true" />
						<Sample>
							<ArrangerAutomation>
								<Events />
								<AutomationTransformViewState>
									<IsTransformPending Value="false" />
									<TimeAndValueTransforms />
								</AutomationTransformViewState>
							</ArrangerAutomation>
						</Sample>
						<VolumeModulationTarget Id="16">
							<LockEnvelope Value="0" />
						</VolumeModulationTarget>
						<TranspositionModulationTarget Id="17">
							<LockEnvelope Value="0" />
						</TranspositionModulationTarget>
						<TransientEnvelopeModulationTarget Id="22179">
							<LockEnvelope Value="0" />
						</TransientEnvelopeModulationTarget>
						<GrainSizeModulationTarget Id="18">
							<LockEnvelope Value="0" />
						</GrainSizeModulationTarget>
						<FluxModulationTarget Id="19">
							<LockEnvelope Value="0" />
						</FluxModulationTarget>
						<SampleOffsetModulationTarget Id="20">
							<LockEnvelope Value="0" />
						</SampleOffsetModulationTarget>
						<ComplexProFormantsModulationTarget Id="22180">
							<LockEnvelope Value="0" />
						</ComplexProFormantsModulationTarget>
						<ComplexProEnvelopeModulationTarget Id="22181">
							<LockEnvelope Value="0" />
						</ComplexProEnvelopeModulationTarget>
						<PitchViewScrollPosition Value="-1073741824" />
						<SampleOffsetModulationScrollPosition Value="-1073741824" />
						<Recorder>
							<IsArmed Value="false" />
							<TakeCounter Value="1" />
						</Recorder>
					</AudioSequencer>
				</FreezeSequencer>
				<DeviceChain>
					<Devices />
					<SignalModulations />
				</DeviceChain>
			</DeviceChain>
		</MainTrack>`;
const PREHEAR_TPL = `		<PreHearTrack SelectedToolPanel="0" SelectedTransformationName="" SelectedGeneratorName="">
			<LomId Value="0" />
			<LomIdView Value="0" />
			<IsContentSelectedInDocument Value="false" />
			<PreferredContentViewMode Value="0" />
			<TrackDelay>
				<Value Value="0" />
				<IsValueSampleBased Value="false" />
			</TrackDelay>
			<Name>
				<EffectiveName Value="0-Main" />
				<UserName Value="" />
				<Annotation Value="" />
				<MemorizedFirstClipName Value="" />
			</Name>
			<Color Value="-1" />
			<AutomationEnvelopes>
				<Envelopes />
			</AutomationEnvelopes>
			<TrackGroupId Value="-1" />
			<TrackUnfolded Value="false" />
			<DevicesListWrapper LomId="0" />
			<ClipSlotsListWrapper LomId="0" />
			<ArrangementClipsListWrapper LomId="0" />
			<TakeLanesListWrapper LomId="0" />
			<ViewData Value="{}" />
			<TakeLanes>
				<TakeLanes />
				<AreTakeLanesFolded Value="true" />
			</TakeLanes>
			<LinkedTrackGroupId Value="-1" />
			<DeviceChain>
				<AutomationLanes>
					<AutomationLanes>
						<AutomationLane Id="0">
							<SelectedDevice Value="0" />
							<SelectedEnvelope Value="0" />
							<IsContentSelectedInDocument Value="false" />
							<LaneHeight Value="85" />
						</AutomationLane>
					</AutomationLanes>
					<AreAdditionalAutomationLanesFolded Value="false" />
				</AutomationLanes>
				<ClipEnvelopeChooserViewState>
					<SelectedDevice Value="0" />
					<SelectedEnvelope Value="0" />
					<PreferModulationVisible Value="false" />
				</ClipEnvelopeChooserViewState>
				<AudioInputRouting>
					<Target Value="AudioIn/External/S0" />
					<UpperDisplayString Value="Ext. In" />
					<LowerDisplayString Value="1/2" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</AudioInputRouting>
				<MidiInputRouting>
					<Target Value="MidiIn/External.All/-1" />
					<UpperDisplayString Value="Ext: All Ins" />
					<LowerDisplayString Value="" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</MidiInputRouting>
				<AudioOutputRouting>
					<Target Value="AudioOut/External/S0" />
					<UpperDisplayString Value="Ext. Out" />
					<LowerDisplayString Value="1/2" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</AudioOutputRouting>
				<MidiOutputRouting>
					<Target Value="MidiOut/None" />
					<UpperDisplayString Value="None" />
					<LowerDisplayString Value="" />
					<MpeSettings>
						<ZoneType Value="0" />
						<FirstNoteChannel Value="1" />
						<LastNoteChannel Value="15" />
					</MpeSettings>
					<MpePitchBendUsesTuning Value="true" />
				</MidiOutputRouting>
				<Mixer>
					<LomId Value="0" />
					<LomIdView Value="0" />
					<IsExpanded Value="true" />
					<BreakoutIsExpanded Value="false" />
					<On>
						<LomId Value="0" />
						<Manual Value="true" />
						<AutomationTarget Id="21">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<MidiCCOnOffThresholds>
							<Min Value="64" />
							<Max Value="127" />
						</MidiCCOnOffThresholds>
					</On>
					<ModulationSourceCount Value="0" />
					<ParametersListWrapper LomId="0" />
					<Pointee Id="19732" />
					<LastSelectedTimeableIndex Value="0" />
					<LastSelectedClipEnvelopeIndex Value="0" />
					<LastPresetRef>
						<Value />
					</LastPresetRef>
					<LockedScripts />
					<IsFolded Value="false" />
					<ShouldShowPresetName Value="false" />
					<UserName Value="" />
					<Annotation Value="" />
					<SourceContext>
						<Value />
					</SourceContext>
					<MpePitchBendUsesTuning Value="true" />
					<ViewData Value="{}" />
					<Sends />
					<Speaker>
						<LomId Value="0" />
						<Manual Value="true" />
						<AutomationTarget Id="22">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<MidiCCOnOffThresholds>
							<Min Value="64" />
							<Max Value="127" />
						</MidiCCOnOffThresholds>
					</Speaker>
					<SoloSink Value="false" />
					<PanMode Value="0" />
					<Pan>
						<LomId Value="0" />
						<Manual Value="0" />
						<MidiControllerRange>
							<Min Value="-1" />
							<Max Value="1" />
						</MidiControllerRange>
						<AutomationTarget Id="23">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="24">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</Pan>
					<SplitStereoPanL>
						<LomId Value="0" />
						<Manual Value="-1" />
						<MidiControllerRange>
							<Min Value="-1" />
							<Max Value="1" />
						</MidiControllerRange>
						<AutomationTarget Id="16179">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="16180">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</SplitStereoPanL>
					<SplitStereoPanR>
						<LomId Value="0" />
						<Manual Value="1" />
						<MidiControllerRange>
							<Min Value="-1" />
							<Max Value="1" />
						</MidiControllerRange>
						<AutomationTarget Id="16181">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="16182">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</SplitStereoPanR>
					<Volume>
						<LomId Value="0" />
						<Manual Value="0.5012149811" />
						<MidiControllerRange>
							<Min Value="0.0003162277571" />
							<Max Value="1.99526238" />
						</MidiControllerRange>
						<AutomationTarget Id="25">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<ModulationTarget Id="26">
							<LockEnvelope Value="0" />
						</ModulationTarget>
					</Volume>
					<ViewStateSessionTrackWidth Value="74" />
					<CrossFadeState>
						<LomId Value="0" />
						<Manual Value="1" />
						<AutomationTarget Id="27">
							<LockEnvelope Value="0" />
						</AutomationTarget>
						<MidiControllerRange>
							<Min Value="0" />
							<Max Value="2" />
						</MidiControllerRange>
					</CrossFadeState>
					<SendsListWrapper LomId="0" />
				</Mixer>
				<DeviceChain>
					<Devices />
					<SignalModulations />
				</DeviceChain>
			</DeviceChain>
		</PreHearTrack>`;
const RETURN_TRACKS_TPL = `			<ReturnTrack Id="2" SelectedToolPanel="7" SelectedTransformationName="" SelectedGeneratorName="">
				<LomId Value="0" />
				<LomIdView Value="0" />
				<IsContentSelectedInDocument Value="false" />
				<PreferredContentViewMode Value="0" />
				<TrackDelay>
					<Value Value="0" />
					<IsValueSampleBased Value="false" />
				</TrackDelay>
				<Name>
					<EffectiveName Value="A-Reverb" />
					<UserName Value="" />
					<Annotation Value="" />
					<MemorizedFirstClipName Value="" />
				</Name>
				<Color Value="0" />
				<AutomationEnvelopes>
					<Envelopes />
				</AutomationEnvelopes>
				<TrackGroupId Value="-1" />
				<TrackUnfolded Value="false" />
				<DevicesListWrapper LomId="0" />
				<ClipSlotsListWrapper LomId="0" />
				<ArrangementClipsListWrapper LomId="0" />
				<TakeLanesListWrapper LomId="0" />
				<ViewData Value="{}" />
				<TakeLanes>
					<TakeLanes />
					<AreTakeLanesFolded Value="true" />
				</TakeLanes>
				<LinkedTrackGroupId Value="-1" />
				<DeviceChain>
					<AutomationLanes>
						<AutomationLanes>
							<AutomationLane Id="0">
								<SelectedDevice Value="2" />
								<SelectedEnvelope Value="2" />
								<IsContentSelectedInDocument Value="false" />
								<LaneHeight Value="85" />
							</AutomationLane>
						</AutomationLanes>
						<AreAdditionalAutomationLanesFolded Value="false" />
					</AutomationLanes>
					<ClipEnvelopeChooserViewState>
						<SelectedDevice Value="0" />
						<SelectedEnvelope Value="0" />
						<PreferModulationVisible Value="false" />
					</ClipEnvelopeChooserViewState>
					<AudioInputRouting>
						<Target Value="AudioIn/External/S0" />
						<UpperDisplayString Value="Ext. In" />
						<LowerDisplayString Value="1/2" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</AudioInputRouting>
					<MidiInputRouting>
						<Target Value="MidiIn/External.All/-1" />
						<UpperDisplayString Value="Ext: All Ins" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</MidiInputRouting>
					<AudioOutputRouting>
						<Target Value="AudioOut/Main" />
						<UpperDisplayString Value="Master" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</AudioOutputRouting>
					<MidiOutputRouting>
						<Target Value="MidiOut/None" />
						<UpperDisplayString Value="None" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</MidiOutputRouting>
					<Mixer>
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="484">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="19724" />
						<LastSelectedTimeableIndex Value="2" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<Sends>
							<TrackSendHolder Id="0">
								<Send>
									<LomId Value="0" />
									<Manual Value="0.0003162277571" />
									<MidiControllerRange>
										<Min Value="0.0003162277571" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="501">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="502">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Send>
								<EnabledByUser Value="false" />
							</TrackSendHolder>
							<TrackSendHolder Id="1">
								<Send>
									<LomId Value="0" />
									<Manual Value="0.0003162277571" />
									<MidiControllerRange>
										<Min Value="0.0003162277571" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="522">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="523">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Send>
								<EnabledByUser Value="false" />
							</TrackSendHolder>
						</Sends>
						<Speaker>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="485">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</Speaker>
						<SoloSink Value="false" />
						<PanMode Value="0" />
						<Pan>
							<LomId Value="0" />
							<Manual Value="0" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="486">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="487">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</Pan>
						<SplitStereoPanL>
							<LomId Value="0" />
							<Manual Value="-1" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="16167">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="16168">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</SplitStereoPanL>
						<SplitStereoPanR>
							<LomId Value="0" />
							<Manual Value="1" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="16169">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="16170">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</SplitStereoPanR>
						<Volume>
							<LomId Value="0" />
							<Manual Value="1" />
							<MidiControllerRange>
								<Min Value="0.0003162277571" />
								<Max Value="1.99526238" />
							</MidiControllerRange>
							<AutomationTarget Id="488">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="489">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</Volume>
						<ViewStateSessionTrackWidth Value="93" />
						<CrossFadeState>
							<LomId Value="0" />
							<Manual Value="1" />
							<AutomationTarget Id="490">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiControllerRange>
								<Min Value="0" />
								<Max Value="2" />
							</MidiControllerRange>
						</CrossFadeState>
						<SendsListWrapper LomId="0" />
					</Mixer>
					<DeviceChain>
						<Devices>
							<Reverb Id="2">
								<LomId Value="0" />
								<LomIdView Value="0" />
								<IsExpanded Value="true" />
								<BreakoutIsExpanded Value="false" />
								<On>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19085">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</On>
								<ModulationSourceCount Value="0" />
								<ParametersListWrapper LomId="0" />
								<Pointee Id="19725" />
								<LastSelectedTimeableIndex Value="0" />
								<LastSelectedClipEnvelopeIndex Value="0" />
								<LastPresetRef>
									<Value>
										<FilePresetRef Id="1">
											<FileRef>
												<RelativePathType Value="1" />
												<RelativePath Value="../../../../Reverb Default.adv" />
												<Path Value="/Reverb Default.adv" />
												<Type Value="2" />
												<LivePackName Value="" />
												<LivePackId Value="" />
												<OriginalFileSize Value="0" />
												<OriginalCrc Value="0" />
												<SourceHint Value="" />
											</FileRef>
										</FilePresetRef>
									</Value>
								</LastPresetRef>
								<LockedScripts />
								<IsFolded Value="false" />
								<ShouldShowPresetName Value="false" />
								<UserName Value="" />
								<Annotation Value="" />
								<SourceContext>
									<Value />
								</SourceContext>
								<MpePitchBendUsesTuning Value="true" />
								<ViewData Value="{}" />
								<OverwriteProtectionNumber Value="3075" />
								<PreDelay>
									<LomId Value="0" />
									<Manual Value="2.5" />
									<MidiControllerRange>
										<Min Value="0.5" />
										<Max Value="250" />
									</MidiControllerRange>
									<AutomationTarget Id="19086">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19087">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</PreDelay>
								<BandHighOn>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19088">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</BandHighOn>
								<BandLowOn>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19089">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</BandLowOn>
								<BandFreq>
									<LomId Value="0" />
									<Manual Value="829.999939" />
									<MidiControllerRange>
										<Min Value="50" />
										<Max Value="18000" />
									</MidiControllerRange>
									<AutomationTarget Id="19090">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19091">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</BandFreq>
								<BandWidth>
									<LomId Value="0" />
									<Manual Value="5.8499999" />
									<MidiControllerRange>
										<Min Value="0.5" />
										<Max Value="9" />
									</MidiControllerRange>
									<AutomationTarget Id="19092">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19093">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</BandWidth>
								<SpinOn>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19094">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</SpinOn>
								<EarlyReflectModFreq>
									<LomId Value="0" />
									<Manual Value="0.2535530031" />
									<MidiControllerRange>
										<Min Value="0.07400000095" />
										<Max Value="1.29999995" />
									</MidiControllerRange>
									<AutomationTarget Id="19095">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19096">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</EarlyReflectModFreq>
								<EarlyReflectModDepth>
									<LomId Value="0" />
									<Manual Value="3" />
									<MidiControllerRange>
										<Min Value="2" />
										<Max Value="55" />
									</MidiControllerRange>
									<AutomationTarget Id="19097">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19098">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</EarlyReflectModDepth>
								<DiffuseDelay>
									<LomId Value="0" />
									<Manual Value="0.5" />
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="19099">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19100">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DiffuseDelay>
								<ShelfHighOn>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19101">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</ShelfHighOn>
								<HighFilterType>
									<LomId Value="0" />
									<Manual Value="0" />
									<AutomationTarget Id="22171">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="1" />
									</MidiControllerRange>
								</HighFilterType>
								<ShelfHiFreq>
									<LomId Value="0" />
									<Manual Value="4500.00049" />
									<MidiControllerRange>
										<Min Value="20" />
										<Max Value="16000" />
									</MidiControllerRange>
									<AutomationTarget Id="19102">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19103">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</ShelfHiFreq>
								<ShelfHiGain>
									<LomId Value="0" />
									<Manual Value="0.6999999881" />
									<MidiControllerRange>
										<Min Value="0.200000003" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="19104">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19105">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</ShelfHiGain>
								<ShelfLowOn>
									<LomId Value="0" />
									<Manual Value="false" />
									<AutomationTarget Id="19106">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</ShelfLowOn>
								<ShelfLoFreq>
									<LomId Value="0" />
									<Manual Value="90" />
									<MidiControllerRange>
										<Min Value="20" />
										<Max Value="15000" />
									</MidiControllerRange>
									<AutomationTarget Id="19107">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19108">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</ShelfLoFreq>
								<ShelfLoGain>
									<LomId Value="0" />
									<Manual Value="0.75" />
									<MidiControllerRange>
										<Min Value="0.200000003" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="19109">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19110">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</ShelfLoGain>
								<ChorusOn>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19111">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</ChorusOn>
								<SizeModFreq>
									<LomId Value="0" />
									<Manual Value="0.01999999955" />
									<MidiControllerRange>
										<Min Value="0.009999999776" />
										<Max Value="8" />
									</MidiControllerRange>
									<AutomationTarget Id="19112">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19113">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</SizeModFreq>
								<SizeModDepth>
									<LomId Value="0" />
									<Manual Value="0.01999999955" />
									<MidiControllerRange>
										<Min Value="0.009999999776" />
										<Max Value="4" />
									</MidiControllerRange>
									<AutomationTarget Id="19114">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19115">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</SizeModDepth>
								<DecayTime>
									<LomId Value="0" />
									<Manual Value="2500" />
									<MidiControllerRange>
										<Min Value="200" />
										<Max Value="60000" />
									</MidiControllerRange>
									<AutomationTarget Id="19116">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19117">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DecayTime>
								<AllPassGain>
									<LomId Value="0" />
									<Manual Value="0.6000000238" />
									<MidiControllerRange>
										<Min Value="0.001000000047" />
										<Max Value="0.9599999785" />
									</MidiControllerRange>
									<AutomationTarget Id="19118">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19119">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</AllPassGain>
								<AllPassSize>
									<LomId Value="0" />
									<Manual Value="0.400000006" />
									<MidiControllerRange>
										<Min Value="0.05000000075" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="19120">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19121">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</AllPassSize>
								<FreezeOn>
									<LomId Value="0" />
									<Manual Value="false" />
									<AutomationTarget Id="19122">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</FreezeOn>
								<FlatOn>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19123">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</FlatOn>
								<CutOn>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="19124">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</CutOn>
								<RoomSize>
									<LomId Value="0" />
									<Manual Value="100.000008" />
									<MidiControllerRange>
										<Min Value="0.2220000029" />
										<Max Value="500" />
									</MidiControllerRange>
									<AutomationTarget Id="19125">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19126">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</RoomSize>
								<SizeSmoothing>
									<LomId Value="0" />
									<Manual Value="0" />
									<AutomationTarget Id="22172">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="2" />
									</MidiControllerRange>
								</SizeSmoothing>
								<StereoSeparation>
									<LomId Value="0" />
									<Manual Value="100" />
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="120" />
									</MidiControllerRange>
									<AutomationTarget Id="19127">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19128">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</StereoSeparation>
								<RoomType>
									<LomId Value="0" />
									<Manual Value="3" />
									<AutomationTarget Id="19129">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="3" />
									</MidiControllerRange>
								</RoomType>
								<MixReflect>
									<LomId Value="0" />
									<Manual Value="1" />
									<MidiControllerRange>
										<Min Value="0.02999999933" />
										<Max Value="1.99530005" />
									</MidiControllerRange>
									<AutomationTarget Id="19130">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19131">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</MixReflect>
								<MixDiffuse>
									<LomId Value="0" />
									<Manual Value="1" />
									<MidiControllerRange>
										<Min Value="0.02999999933" />
										<Max Value="1.99530005" />
									</MidiControllerRange>
									<AutomationTarget Id="19132">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19133">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</MixDiffuse>
								<MixDirect>
									<LomId Value="0" />
									<Manual Value="1" />
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="19134">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="19135">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</MixDirect>
								<StereoSeparationOnDrySignal Value="false" />
							</Reverb>
						</Devices>
						<SignalModulations />
					</DeviceChain>
					<FreezeSequencer>
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="491">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="19726" />
						<LastSelectedTimeableIndex Value="0" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<ClipSlotList />
						<MonitoringEnum Value="1" />
						<KeepRecordMonitoringLatency Value="true" />
						<Sample>
							<ArrangerAutomation>
								<Events />
								<AutomationTransformViewState>
									<IsTransformPending Value="false" />
									<TimeAndValueTransforms />
								</AutomationTransformViewState>
							</ArrangerAutomation>
						</Sample>
						<VolumeModulationTarget Id="492">
							<LockEnvelope Value="0" />
						</VolumeModulationTarget>
						<TranspositionModulationTarget Id="493">
							<LockEnvelope Value="0" />
						</TranspositionModulationTarget>
						<TransientEnvelopeModulationTarget Id="22173">
							<LockEnvelope Value="0" />
						</TransientEnvelopeModulationTarget>
						<GrainSizeModulationTarget Id="494">
							<LockEnvelope Value="0" />
						</GrainSizeModulationTarget>
						<FluxModulationTarget Id="495">
							<LockEnvelope Value="0" />
						</FluxModulationTarget>
						<SampleOffsetModulationTarget Id="496">
							<LockEnvelope Value="0" />
						</SampleOffsetModulationTarget>
						<ComplexProFormantsModulationTarget Id="22174">
							<LockEnvelope Value="0" />
						</ComplexProFormantsModulationTarget>
						<ComplexProEnvelopeModulationTarget Id="22175">
							<LockEnvelope Value="0" />
						</ComplexProEnvelopeModulationTarget>
						<PitchViewScrollPosition Value="-1073741824" />
						<SampleOffsetModulationScrollPosition Value="-1073741824" />
						<Recorder>
							<IsArmed Value="false" />
							<TakeCounter Value="1" />
						</Recorder>
					</FreezeSequencer>
				</DeviceChain>
			</ReturnTrack>
			<ReturnTrack Id="3" SelectedToolPanel="7" SelectedTransformationName="" SelectedGeneratorName="">
				<LomId Value="0" />
				<LomIdView Value="0" />
				<IsContentSelectedInDocument Value="false" />
				<PreferredContentViewMode Value="0" />
				<TrackDelay>
					<Value Value="0" />
					<IsValueSampleBased Value="false" />
				</TrackDelay>
				<Name>
					<EffectiveName Value="B-Delay" />
					<UserName Value="" />
					<Annotation Value="" />
					<MemorizedFirstClipName Value="" />
				</Name>
				<Color Value="11" />
				<AutomationEnvelopes>
					<Envelopes />
				</AutomationEnvelopes>
				<TrackGroupId Value="-1" />
				<TrackUnfolded Value="false" />
				<DevicesListWrapper LomId="0" />
				<ClipSlotsListWrapper LomId="0" />
				<ArrangementClipsListWrapper LomId="0" />
				<TakeLanesListWrapper LomId="0" />
				<ViewData Value="{}" />
				<TakeLanes>
					<TakeLanes />
					<AreTakeLanesFolded Value="true" />
				</TakeLanes>
				<LinkedTrackGroupId Value="-1" />
				<DeviceChain>
					<AutomationLanes>
						<AutomationLanes>
							<AutomationLane Id="0">
								<SelectedDevice Value="1" />
								<SelectedEnvelope Value="1" />
								<IsContentSelectedInDocument Value="false" />
								<LaneHeight Value="85" />
							</AutomationLane>
						</AutomationLanes>
						<AreAdditionalAutomationLanesFolded Value="false" />
					</AutomationLanes>
					<ClipEnvelopeChooserViewState>
						<SelectedDevice Value="0" />
						<SelectedEnvelope Value="0" />
						<PreferModulationVisible Value="false" />
					</ClipEnvelopeChooserViewState>
					<AudioInputRouting>
						<Target Value="AudioIn/External/S0" />
						<UpperDisplayString Value="Ext. In" />
						<LowerDisplayString Value="1/2" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</AudioInputRouting>
					<MidiInputRouting>
						<Target Value="MidiIn/External.All/-1" />
						<UpperDisplayString Value="Ext: All Ins" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</MidiInputRouting>
					<AudioOutputRouting>
						<Target Value="AudioOut/Main" />
						<UpperDisplayString Value="Master" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</AudioOutputRouting>
					<MidiOutputRouting>
						<Target Value="MidiOut/None" />
						<UpperDisplayString Value="None" />
						<LowerDisplayString Value="" />
						<MpeSettings>
							<ZoneType Value="0" />
							<FirstNoteChannel Value="1" />
							<LastNoteChannel Value="15" />
						</MpeSettings>
						<MpePitchBendUsesTuning Value="true" />
					</MidiOutputRouting>
					<Mixer>
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="503">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="19727" />
						<LastSelectedTimeableIndex Value="0" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<Sends>
							<TrackSendHolder Id="0">
								<Send>
									<LomId Value="0" />
									<Manual Value="0.0003162277571" />
									<MidiControllerRange>
										<Min Value="0.0003162277571" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="504">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="505">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Send>
								<EnabledByUser Value="false" />
							</TrackSendHolder>
							<TrackSendHolder Id="1">
								<Send>
									<LomId Value="0" />
									<Manual Value="0.0003162277571" />
									<MidiControllerRange>
										<Min Value="0.0003162277571" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="524">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="525">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Send>
								<EnabledByUser Value="false" />
							</TrackSendHolder>
						</Sends>
						<Speaker>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="506">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</Speaker>
						<SoloSink Value="false" />
						<PanMode Value="0" />
						<Pan>
							<LomId Value="0" />
							<Manual Value="0" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="507">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="508">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</Pan>
						<SplitStereoPanL>
							<LomId Value="0" />
							<Manual Value="-1" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="16171">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="16172">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</SplitStereoPanL>
						<SplitStereoPanR>
							<LomId Value="0" />
							<Manual Value="1" />
							<MidiControllerRange>
								<Min Value="-1" />
								<Max Value="1" />
							</MidiControllerRange>
							<AutomationTarget Id="16173">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="16174">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</SplitStereoPanR>
						<Volume>
							<LomId Value="0" />
							<Manual Value="1" />
							<MidiControllerRange>
								<Min Value="0.0003162277571" />
								<Max Value="1.99526238" />
							</MidiControllerRange>
							<AutomationTarget Id="509">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<ModulationTarget Id="510">
								<LockEnvelope Value="0" />
							</ModulationTarget>
						</Volume>
						<ViewStateSessionTrackWidth Value="93" />
						<CrossFadeState>
							<LomId Value="0" />
							<Manual Value="1" />
							<AutomationTarget Id="511">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiControllerRange>
								<Min Value="0" />
								<Max Value="2" />
							</MidiControllerRange>
						</CrossFadeState>
						<SendsListWrapper LomId="0" />
					</Mixer>
					<DeviceChain>
						<Devices>
							<Delay Id="7">
								<LomId Value="0" />
								<LomIdView Value="0" />
								<IsExpanded Value="true" />
								<BreakoutIsExpanded Value="false" />
								<On>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="10578">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</On>
								<ModulationSourceCount Value="0" />
								<ParametersListWrapper LomId="0" />
								<Pointee Id="19728" />
								<LastSelectedTimeableIndex Value="1" />
								<LastSelectedClipEnvelopeIndex Value="0" />
								<LastPresetRef>
									<Value>
										<FilePresetRef Id="0">
											<FileRef>
												<RelativePathType Value="1" />
												<RelativePath Value="../../../nsh/Library/Application Support/Ableton/Live 11 Core Library/Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv" />
												<Path Value="/Users/nsh/Library/Application Support/Ableton/Live 11 Core Library/Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv" />
												<Type Value="2" />
												<LivePackName Value="" />
												<LivePackId Value="" />
												<OriginalFileSize Value="0" />
												<OriginalCrc Value="0" />
												<SourceHint Value="" />
											</FileRef>
										</FilePresetRef>
									</Value>
								</LastPresetRef>
								<LockedScripts />
								<IsFolded Value="false" />
								<ShouldShowPresetName Value="true" />
								<UserName Value="Delay" />
								<Annotation Value="" />
								<SourceContext>
									<Value>
										<BranchSourceContext Id="0">
											<OriginalFileRef>
												<FileRef Id="0">
													<RelativePathType Value="5" />
													<RelativePath Value="Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv" />
													<Path Value="/Dotted Eighth Note.adv" />
													<Type Value="2" />
													<LivePackName Value="Core Library" />
													<LivePackId Value="www.ableton.com/0" />
													<OriginalFileSize Value="0" />
													<OriginalCrc Value="0" />
													<SourceHint Value="" />
												</FileRef>
											</OriginalFileRef>
											<BrowserContentPath Value="query:AudioFx#Simple%20Delay:Dotted%20Eighth%20Note.adv" />
											<LocalFiltersJson Value="" />
											<PresetRef>
												<FilePresetRef Id="0">
													<FileRef>
														<RelativePathType Value="1" />
														<RelativePath Value="../../../nsh/Library/Application Support/Ableton/Live 11 Core Library/Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv" />
														<Path Value="/Users/nsh/Library/Application Support/Ableton/Live 11 Core Library/Devices/Audio Effects/Simple Delay/Dotted Eighth Note.adv" />
														<Type Value="2" />
														<LivePackName Value="" />
														<LivePackId Value="" />
														<OriginalFileSize Value="0" />
														<OriginalCrc Value="0" />
														<SourceHint Value="" />
													</FileRef>
												</FilePresetRef>
											</PresetRef>
											<BranchDeviceId Value="device:ableton:audiofx:CrossDelay?n=Simple%20Delay" />
										</BranchSourceContext>
									</Value>
								</SourceContext>
								<MpePitchBendUsesTuning Value="true" />
								<ViewData Value="{}" />
								<OverwriteProtectionNumber Value="3075" />
								<DelayLine_SmoothingMode>
									<LomId Value="0" />
									<Manual Value="0" />
									<AutomationTarget Id="17335">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="2" />
									</MidiControllerRange>
								</DelayLine_SmoothingMode>
								<DelayLine_Link>
									<LomId Value="0" />
									<Manual Value="false" />
									<AutomationTarget Id="10579">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</DelayLine_Link>
								<DelayLine_PingPong>
									<LomId Value="0" />
									<Manual Value="false" />
									<AutomationTarget Id="17336">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</DelayLine_PingPong>
								<DelayLine_SyncL>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="10580">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</DelayLine_SyncL>
								<DelayLine_SyncR>
									<LomId Value="0" />
									<Manual Value="true" />
									<AutomationTarget Id="10586">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</DelayLine_SyncR>
								<DelayLine_TimeL>
									<LomId Value="0" />
									<Manual Value="0.02209999785" />
									<MidiControllerRange>
										<Min Value="0.001000000047" />
										<Max Value="5" />
									</MidiControllerRange>
									<AutomationTarget Id="17337">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17338">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_TimeL>
								<DelayLine_TimeR>
									<LomId Value="0" />
									<Manual Value="0.02289999276" />
									<MidiControllerRange>
										<Min Value="0.001000000047" />
										<Max Value="5" />
									</MidiControllerRange>
									<AutomationTarget Id="17339">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17340">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_TimeR>
								<DelayLine_SimpleDelayTimeL>
									<LomId Value="0" />
									<Manual Value="22.1000004" />
									<MidiControllerRange>
										<Min Value="1" />
										<Max Value="300" />
									</MidiControllerRange>
									<AutomationTarget Id="10584">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="10585">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_SimpleDelayTimeL>
								<DelayLine_SimpleDelayTimeR>
									<LomId Value="0" />
									<Manual Value="22.8999996" />
									<MidiControllerRange>
										<Min Value="1" />
										<Max Value="300" />
									</MidiControllerRange>
									<AutomationTarget Id="10590">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="10591">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_SimpleDelayTimeR>
								<DelayLine_PingPongDelayTimeL>
									<LomId Value="0" />
									<Manual Value="1" />
									<MidiControllerRange>
										<Min Value="1" />
										<Max Value="999" />
									</MidiControllerRange>
									<AutomationTarget Id="17341">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17342">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_PingPongDelayTimeL>
								<DelayLine_PingPongDelayTimeR>
									<LomId Value="0" />
									<Manual Value="1" />
									<MidiControllerRange>
										<Min Value="1" />
										<Max Value="999" />
									</MidiControllerRange>
									<AutomationTarget Id="17343">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17344">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_PingPongDelayTimeR>
								<DelayLine_SyncedSixteenthL>
									<LomId Value="0" />
									<Manual Value="2" />
									<AutomationTarget Id="10581">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="7" />
									</MidiControllerRange>
								</DelayLine_SyncedSixteenthL>
								<DelayLine_SyncedSixteenthR>
									<LomId Value="0" />
									<Manual Value="2" />
									<AutomationTarget Id="10587">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="7" />
									</MidiControllerRange>
								</DelayLine_SyncedSixteenthR>
								<DelayLine_OffsetL>
									<LomId Value="0" />
									<Manual Value="0" />
									<MidiControllerRange>
										<Min Value="-0.3330000043" />
										<Max Value="0.3330000043" />
									</MidiControllerRange>
									<AutomationTarget Id="10582">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="10583">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_OffsetL>
								<DelayLine_OffsetR>
									<LomId Value="0" />
									<Manual Value="0" />
									<MidiControllerRange>
										<Min Value="-0.3330000043" />
										<Max Value="0.3330000043" />
									</MidiControllerRange>
									<AutomationTarget Id="10588">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="10589">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DelayLine_OffsetR>
								<DelayLine_CompatibilityMode Value="0" />
								<Feedback>
									<LomId Value="0" />
									<Manual Value="0.2099999934" />
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="0.9499999881" />
									</MidiControllerRange>
									<AutomationTarget Id="10592">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="10593">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Feedback>
								<Freeze>
									<LomId Value="0" />
									<Manual Value="false" />
									<AutomationTarget Id="17345">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</Freeze>
								<Filter_On>
									<LomId Value="0" />
									<Manual Value="false" />
									<AutomationTarget Id="17346">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<MidiCCOnOffThresholds>
										<Min Value="64" />
										<Max Value="127" />
									</MidiCCOnOffThresholds>
								</Filter_On>
								<Filter_Frequency>
									<LomId Value="0" />
									<Manual Value="999.999878" />
									<MidiControllerRange>
										<Min Value="49.9999962" />
										<Max Value="18000.0059" />
									</MidiControllerRange>
									<AutomationTarget Id="17347">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17348">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Filter_Frequency>
								<Filter_Bandwidth>
									<LomId Value="0" />
									<Manual Value="8" />
									<MidiControllerRange>
										<Min Value="0.5" />
										<Max Value="9" />
									</MidiControllerRange>
									<AutomationTarget Id="17349">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17350">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Filter_Bandwidth>
								<Modulation_Frequency>
									<LomId Value="0" />
									<Manual Value="0.5" />
									<MidiControllerRange>
										<Min Value="0.01000000071" />
										<Max Value="39.9999962" />
									</MidiControllerRange>
									<AutomationTarget Id="17351">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17352">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Modulation_Frequency>
								<Modulation_AmountTime>
									<LomId Value="0" />
									<Manual Value="0" />
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="17353">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17354">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Modulation_AmountTime>
								<Modulation_AmountFilter>
									<LomId Value="0" />
									<Manual Value="0" />
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="17355">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="17356">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</Modulation_AmountFilter>
								<DryWet>
									<LomId Value="0" />
									<Manual Value="1" />
									<MidiControllerRange>
										<Min Value="0" />
										<Max Value="1" />
									</MidiControllerRange>
									<AutomationTarget Id="10594">
										<LockEnvelope Value="0" />
									</AutomationTarget>
									<ModulationTarget Id="10595">
										<LockEnvelope Value="0" />
									</ModulationTarget>
								</DryWet>
								<DryWetMode Value="1" />
								<EcoProcessing Value="false" />
							</Delay>
						</Devices>
						<SignalModulations />
					</DeviceChain>
					<FreezeSequencer>
						<LomId Value="0" />
						<LomIdView Value="0" />
						<IsExpanded Value="true" />
						<BreakoutIsExpanded Value="false" />
						<On>
							<LomId Value="0" />
							<Manual Value="true" />
							<AutomationTarget Id="512">
								<LockEnvelope Value="0" />
							</AutomationTarget>
							<MidiCCOnOffThresholds>
								<Min Value="64" />
								<Max Value="127" />
							</MidiCCOnOffThresholds>
						</On>
						<ModulationSourceCount Value="0" />
						<ParametersListWrapper LomId="0" />
						<Pointee Id="19729" />
						<LastSelectedTimeableIndex Value="0" />
						<LastSelectedClipEnvelopeIndex Value="0" />
						<LastPresetRef>
							<Value />
						</LastPresetRef>
						<LockedScripts />
						<IsFolded Value="false" />
						<ShouldShowPresetName Value="false" />
						<UserName Value="" />
						<Annotation Value="" />
						<SourceContext>
							<Value />
						</SourceContext>
						<MpePitchBendUsesTuning Value="true" />
						<ViewData Value="{}" />
						<ClipSlotList />
						<MonitoringEnum Value="1" />
						<KeepRecordMonitoringLatency Value="true" />
						<Sample>
							<ArrangerAutomation>
								<Events />
								<AutomationTransformViewState>
									<IsTransformPending Value="false" />
									<TimeAndValueTransforms />
								</AutomationTransformViewState>
							</ArrangerAutomation>
						</Sample>
						<VolumeModulationTarget Id="513">
							<LockEnvelope Value="0" />
						</VolumeModulationTarget>
						<TranspositionModulationTarget Id="514">
							<LockEnvelope Value="0" />
						</TranspositionModulationTarget>
						<TransientEnvelopeModulationTarget Id="22176">
							<LockEnvelope Value="0" />
						</TransientEnvelopeModulationTarget>
						<GrainSizeModulationTarget Id="515">
							<LockEnvelope Value="0" />
						</GrainSizeModulationTarget>
						<FluxModulationTarget Id="516">
							<LockEnvelope Value="0" />
						</FluxModulationTarget>
						<SampleOffsetModulationTarget Id="517">
							<LockEnvelope Value="0" />
						</SampleOffsetModulationTarget>
						<ComplexProFormantsModulationTarget Id="22177">
							<LockEnvelope Value="0" />
						</ComplexProFormantsModulationTarget>
						<ComplexProEnvelopeModulationTarget Id="22178">
							<LockEnvelope Value="0" />
						</ComplexProEnvelopeModulationTarget>
						<PitchViewScrollPosition Value="-1073741824" />
						<SampleOffsetModulationScrollPosition Value="-1073741824" />
						<Recorder>
							<IsArmed Value="false" />
							<TakeCounter Value="1" />
						</Recorder>
					</FreezeSequencer>
				</DeviceChain>
			</ReturnTrack>`;
const LIVESET_TAIL = `		<Transport>
			<PhaseNudgeTempo Value="10" />
			<LoopOn Value="false" />
			<LoopStart Value="0" />
			<LoopLength Value="16" />
			<LoopIsSongStart Value="false" />
			<CurrentTime Value="0" />
			<PunchIn Value="false" />
			<PunchOut Value="false" />
			<MetronomeTickDuration Value="0" />
			<DrawMode Value="false" />
		</Transport>
		<SessionScrollPos X="0" Y="0" />
		<SelectedBreakpointValue Value="0" />
		<SignalModulations />
		<GlobalQuantisation Value="4" />
		<AutoQuantisation Value="0" />
		<Grid>
			<FixedNumerator Value="1" />
			<FixedDenominator Value="16" />
			<GridIntervalPixel Value="20" />
			<Ntoles Value="2" />
			<SnapToGrid Value="true" />
			<Fixed Value="false" />
		</Grid>
		<ScaleInformation>
			<Root Value="5" />
			<Name Value="1" />
		</ScaleInformation>
		<InKey Value="true" />
		<SmpteFormat Value="0" />
		<TimeSelection>
			<AnchorTime Value="0" />
			<OtherTime Value="0" />
		</TimeSelection>
		<SequencerNavigator>
			<BeatTimeHelper>
				<CurrentZoom Value="0.254945054945054927" />
			</BeatTimeHelper>
			<ScrollerPos X="0" Y="0" />
			<ClientSize X="745" Y="490" />
		</SequencerNavigator>
		<IsContentSplitterOpen Value="true" />
		<IsExpressionSplitterOpen Value="true" />
		<ExpressionLanes>
			<MidiEditorLaneModel Id="0">
				<Type Value="5" />
				<Size Value="41" />
				<IsMinimized Value="true" />
			</MidiEditorLaneModel>
			<MidiEditorLaneModel Id="1">
				<Type Value="0" />
				<Size Value="41" />
				<IsMinimized Value="false" />
			</MidiEditorLaneModel>
			<MidiEditorLaneModel Id="2">
				<Type Value="1" />
				<Size Value="41" />
				<IsMinimized Value="false" />
			</MidiEditorLaneModel>
			<MidiEditorLaneModel Id="3">
				<Type Value="2" />
				<Size Value="41" />
				<IsMinimized Value="true" />
			</MidiEditorLaneModel>
			<MidiEditorLaneModel Id="4">
				<Type Value="3" />
				<Size Value="41" />
				<IsMinimized Value="true" />
			</MidiEditorLaneModel>
		</ExpressionLanes>
		<ContentLanes>
			<MidiEditorLaneModel Id="0">
				<Type Value="2" />
				<Size Value="41" />
				<IsMinimized Value="false" />
			</MidiEditorLaneModel>
			<MidiEditorLaneModel Id="2">
				<Type Value="3" />
				<Size Value="25" />
				<IsMinimized Value="true" />
			</MidiEditorLaneModel>
			<MidiEditorLaneModel Id="1">
				<Type Value="4" />
				<Size Value="25" />
				<IsMinimized Value="true" />
			</MidiEditorLaneModel>
		</ContentLanes>
		<ViewStateFxSlotCount Value="4" />
		<ViewStateSessionMixerVolumeSectionHeight Value="120" />
		<ViewStateArrangerMixerVolumeSectionHeight Value="120" />
		<ShouldSceneTempoAndTimeSignatureBeVisible Value="false" />
		<WaveformVerticalZoomFactor Value="1" />
		<IsWaveformVerticalZoomActive Value="true" />
		<Locators>
			<Locators />
		</Locators>
		<DetailClipKeyMidis />
		<TracksListWrapper LomId="0" />
		<VisibleTracksListWrapper LomId="0" />
		<ReturnTracksListWrapper LomId="0" />
		<ScenesListWrapper LomId="0" />
		<CuePointsListWrapper LomId="0" />
		<SelectedDocumentViewInMainWindow Value="1" />
		<Annotation Value="" />
		<SoloOrPflSavedValue Value="true" />
		<SoloInPlace Value="true" />
		<CrossfadeCurve Value="2" />
		<LatencyCompensation Value="2" />
		<HighlightedTrackIndex Value="0" />
		<GroovePool>
			<LomId Value="0" />
			<Grooves>
				<Groove Id="4">
					<LomId Value="0" />
					<Name Value="Swing 16ths 66" />
					<Clip>
						<Value>
							<MidiClip Id="0" Time="0">
								<LomId Value="0" />
								<LomIdView Value="0" />
								<CurrentStart Value="0" />
								<CurrentEnd Value="4" />
								<Loop>
									<LoopStart Value="0" />
									<LoopEnd Value="4" />
									<StartRelative Value="0" />
									<LoopOn Value="true" />
									<OutMarker Value="4" />
									<HiddenLoopStart Value="0" />
									<HiddenLoopEnd Value="0.5" />
								</Loop>
								<Name Value="Swing 16ths 66" />
								<Annotation Value="" />
								<Color Value="7" />
								<LaunchMode Value="0" />
								<LaunchQuantisation Value="0" />
								<TimeSignature>
									<TimeSignatures>
										<RemoteableTimeSignature Id="0">
											<Numerator Value="4" />
											<Denominator Value="4" />
											<Time Value="0" />
										</RemoteableTimeSignature>
									</TimeSignatures>
								</TimeSignature>
								<Envelopes>
									<Envelopes />
								</Envelopes>
								<ScrollerTimePreserver>
									<LeftTime Value="0" />
									<RightTime Value="4" />
								</ScrollerTimePreserver>
								<TimeSelection>
									<AnchorTime Value="0" />
									<OtherTime Value="3.8958333333333335" />
								</TimeSelection>
								<Legato Value="false" />
								<Ram Value="false" />
								<GrooveSettings>
									<GrooveId Value="-1" />
								</GrooveSettings>
								<Disabled Value="false" />
								<VelocityAmount Value="0" />
								<FollowAction>
									<FollowTime Value="4" />
									<IsLinked Value="true" />
									<LoopIterations Value="1" />
									<FollowActionA Value="4" />
									<FollowActionB Value="0" />
									<FollowChanceA Value="100" />
									<FollowChanceB Value="0" />
									<JumpIndexA Value="2" />
									<JumpIndexB Value="2" />
									<FollowActionEnabled Value="false" />
								</FollowAction>
								<Grid>
									<FixedNumerator Value="1" />
									<FixedDenominator Value="16" />
									<GridIntervalPixel Value="20" />
									<Ntoles Value="2" />
									<SnapToGrid Value="true" />
									<Fixed Value="true" />
								</Grid>
								<FreezeStart Value="0" />
								<FreezeEnd Value="0" />
								<IsWarped Value="true" />
								<TakeId Value="0" />
								<IsInKey Value="true" />
								<ScaleInformation>
									<Root Value="0" />
									<Name Value="0" />
								</ScaleInformation>
								<Notes>
									<KeyTracks>
										<KeyTrack Id="31">
											<Notes>
												<MidiNoteEvent Time="0" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="1" />
												<MidiNoteEvent Time="0.333333333333333315" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="2" />
												<MidiNoteEvent Time="0.5" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="18" />
												<MidiNoteEvent Time="0.83333333333333337" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="19" />
												<MidiNoteEvent Time="1" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="20" />
												<MidiNoteEvent Time="1.3333333333333333" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="21" />
												<MidiNoteEvent Time="1.5" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="22" />
												<MidiNoteEvent Time="1.8333333333333333" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="23" />
												<MidiNoteEvent Time="2" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="24" />
												<MidiNoteEvent Time="2.3333333333333335" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="25" />
												<MidiNoteEvent Time="2.5" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="26" />
												<MidiNoteEvent Time="2.8333333333333335" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="27" />
												<MidiNoteEvent Time="3" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="28" />
												<MidiNoteEvent Time="3.3333333333333335" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="29" />
												<MidiNoteEvent Time="3.5" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="30" />
												<MidiNoteEvent Time="3.8333333333333335" Duration="0.0625" Velocity="127" OffVelocity="64" NoteId="31" />
											</Notes>
											<MidiKey Value="36" />
										</KeyTrack>
									</KeyTracks>
									<PerNoteEventStore>
										<EventLists />
									</PerNoteEventStore>
									<NoteProbabilityGroups />
									<ProbabilityGroupIdGenerator>
										<NextId Value="1" />
									</ProbabilityGroupIdGenerator>
									<NoteIdGenerator>
										<NextId Value="32" />
									</NoteIdGenerator>
								</Notes>
								<BankSelectCoarse Value="-1" />
								<BankSelectFine Value="-1" />
								<ProgramChange Value="-1" />
								<NoteEditorFoldInZoom Value="24" />
								<NoteEditorFoldInScroll Value="0" />
								<NoteEditorFoldOutZoom Value="2409" />
								<NoteEditorFoldOutScroll Value="-1553" />
								<NoteEditorFoldScaleZoom Value="-1" />
								<NoteEditorFoldScaleScroll Value="0" />
								<NoteSpellingPreference Value="0" />
								<AccidentalSpellingPreference Value="3" />
								<PreferFlatRootNote Value="false" />
								<ExpressionGrid>
									<FixedNumerator Value="1" />
									<FixedDenominator Value="16" />
									<GridIntervalPixel Value="20" />
									<Ntoles Value="2" />
									<SnapToGrid Value="false" />
									<Fixed Value="false" />
								</ExpressionGrid>
							</MidiClip>
						</Value>
					</Clip>
					<Grid Value="3" />
					<QuantizationAmount Value="0" />
					<TimingAmount Value="100" />
					<RandomAmount Value="0" />
					<VelocityAmount Value="0" />
					<Annotation Value="" />
					<Selection Value="true" />
					<SourceContext />
				</Groove>
			</Grooves>
			<DefaultGrooveId Value="4" />
			<GroovesListWrapper LomId="0" />
		</GroovePool>
		<AutomationMode Value="false" />
		<SnapAutomationToGrid Value="true" />
		<ArrangementOverdub Value="false" />
		<ColorSequenceIndex Value="0" />
		<AutoColorPickerForPlayerAndGroupTracks>
			<NextColorIndex Value="12" />
		</AutoColorPickerForPlayerAndGroupTracks>
		<AutoColorPickerForReturnAndMainTracks>
			<NextColorIndex Value="0" />
		</AutoColorPickerForReturnAndMainTracks>
		<ViewData Value="{}" />
		<ResetNonautomatedMidiControllersOnClipStarts Value="true" />
		<MidiFoldIn Value="false" />
		<MidiFoldMode Value="-99" />
		<MultiClipFocusMode Value="false" />
		<MultiClipLoopBarHeight Value="0" />
		<MidiPrelisten Value="false" />
		<LinkedTrackGroups />
		<NoteSpellingPreference Value="0" />
		<AccidentalSpellingPreference Value="3" />
		<PreferFlatRootNote Value="false" />
		<UseWarperLegacyHiQMode Value="false" />
		<VideoWindowRect Top="-2147483648" Left="-2147483648" Bottom="-2147483648" Right="-2147483648" />
		<ShowVideoWindow Value="true" />
		<TuningSystems />
		<TrackHeaderWidth Value="93" />
		<ViewStateMainWindowClipDetailOpen Value="false" />
		<ViewStateMainWindowHiddenOtherDocViewTypeClipDetailOpen Value="false" />
		<ViewStateMainWindowHiddenOtherDocViewTypeDeviceDetailOpen Value="true" />
		<ViewStateMainWindowDeviceDetailOpen Value="true" />
		<ViewStateSecondWindowClipDetailOpen Value="true" />
		<ViewStateSecondWindowDeviceDetailOpen Value="false" />
		<ViewStates>
			<MixerInArrangement Value="0" />
			<ArrangerMixerIO Value="1" />
			<ArrangerMixerSends Value="1" />
			<ArrangerMixerReturns Value="1" />
			<ArrangerMixerVolume Value="1" />
			<ArrangerMixerTrackOptions Value="0" />
			<ArrangerMixerCrossFade Value="0" />
			<ArrangerMixerTrackPerformanceImpactMeter Value="0" />
			<MixerInSession Value="1" />
			<SessionIO Value="1" />
			<SessionSends Value="1" />
			<SessionReturns Value="1" />
			<SessionVolume Value="1" />
			<SessionTrackOptions Value="0" />
			<SessionCrossFade Value="0" />
			<SessionTrackPerformanceImpactMeter Value="0" />
			<SessionShowOverView Value="0" />
			<ArrangerIO Value="1" />
			<ArrangerReturns Value="1" />
			<ArrangerVolume Value="1" />
			<ArrangerTrackOptions Value="0" />
			<ArrangerShowOverView Value="1" />
		</ViewStates>
		<NoteAlgorithms>
			<ArpeggiateAlgorithm Id="0">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="30" Name="Rate" />
					<NamedRemoteableKeyMidi Id="31" Name="Steps" />
					<NamedRemoteableKeyMidi Id="32" Name="Distance" />
					<NamedRemoteableKeyMidi Id="33" Name="Gate" />
					<NamedRemoteableKeyMidi Id="34" Name="Style" />
				</NamedKeyMidiRemoteables>
				<Rate Value="10" />
				<Steps Value="2" />
				<Distance Value="12" />
				<Gate Value="1" />
				<Style Value="0" />
			</ArpeggiateAlgorithm>
			<SpanAlgorithm Id="1">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="18" Name="Mode" />
					<NamedRemoteableKeyMidi Id="19" Name="LengthVariation" />
					<NamedRemoteableKeyMidi Id="20" Name="LengthOffset" />
				</NamedKeyMidiRemoteables>
				<Mode Value="1" />
				<ChordThreshold Value="10" />
				<LengthVariation Value="0" />
				<LengthOffset Value="0" />
			</SpanAlgorithm>
			<ConnectAlgorithm Id="2">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="24" Name="Tie" />
					<NamedRemoteableKeyMidi Id="25" Name="Density" />
					<NamedRemoteableKeyMidi Id="26" Name="Spread" />
					<NamedRemoteableKeyMidi Id="27" Name="Rate" />
				</NamedKeyMidiRemoteables>
				<Tie Value="0" />
				<Density Value="1" />
				<Spread Value="0" />
				<Rate Value="0" />
			</ConnectAlgorithm>
			<OrnamentAlgorithm Id="3">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="54" Name="FlamEnabled" />
					<NamedRemoteableKeyMidi Id="55" Name="FlamPosition" />
					<NamedRemoteableKeyMidi Id="56" Name="FlamVelocity" />
					<NamedRemoteableKeyMidi Id="57" Name="GraceNotesEnabled" />
					<NamedRemoteableKeyMidi Id="58" Name="GraceNotesChance" />
					<NamedRemoteableKeyMidi Id="59" Name="GraceNotesVelocity" />
					<NamedRemoteableKeyMidi Id="60" Name="GraceNotesPosition" />
					<NamedRemoteableKeyMidi Id="61" Name="GraceNotesAmount" />
					<NamedRemoteableKeyMidi Id="62" Name="GraceNotesPitch" />
				</NamedKeyMidiRemoteables>
				<FlamEnabled Value="true" />
				<FlamPosition Value="-0.200000003" />
				<FlamVelocity Value="0.5" />
				<GraceNotesEnabled Value="false" />
				<GraceNotesChance Value="1" />
				<GraceNotesVelocity Value="0.5" />
				<GraceNotesPosition Value="-0.200000003" />
				<GraceNotesAmount Value="3" />
				<GraceNotesPitch Value="1" />
			</OrnamentAlgorithm>
			<RecombineAlgorithm Id="4">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="30" Name="Dimension" />
					<NamedRemoteableKeyMidi Id="31" Name="Shuffle" />
					<NamedRemoteableKeyMidi Id="32" Name="Mirror" />
					<NamedRemoteableKeyMidi Id="33" Name="RotateAmount" />
					<NamedRemoteableKeyMidi Id="34" Name="RotateOnGrid" />
				</NamedKeyMidiRemoteables>
				<PermutedDimension Value="0" />
				<Shuffle Value="false" />
				<Mirror Value="false" />
				<RotateAmount Value="0" />
				<RotateOnGrid Value="false" />
			</RecombineAlgorithm>
			<QuantizeAlgorithm Id="5">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="30" Name="TripletReference" />
					<NamedRemoteableKeyMidi Id="31" Name="QuantizeReference" />
					<NamedRemoteableKeyMidi Id="32" Name="Amount" />
					<NamedRemoteableKeyMidi Id="33" Name="QuantizeNoteStarts" />
					<NamedRemoteableKeyMidi Id="34" Name="QuantizeNoteEnds" />
				</NamedKeyMidiRemoteables>
				<Reference Value="0" />
				<TripletReference Value="false" />
				<QuantizeNoteStarts Value="true" />
				<QuantizeNoteEnds Value="false" />
				<Amount Value="100" />
			</QuantizeAlgorithm>
			<StrumAlgorithm Id="6">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="24" Name="Threshold" />
					<NamedRemoteableKeyMidi Id="25" Name="Low" />
					<NamedRemoteableKeyMidi Id="26" Name="High" />
					<NamedRemoteableKeyMidi Id="27" Name="Tension" />
				</NamedKeyMidiRemoteables>
				<ChordThreshold Value="0" />
				<StrumLow Value="0" />
				<StrumHigh Value="0" />
				<TensionAmount Value="0" />
			</StrumAlgorithm>
			<TimeWarpAlgorithm Id="7">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="126" Name="StretchNoteEnd" />
					<NamedRemoteableKeyMidi Id="127" Name="PreserveTimeRange" />
					<NamedRemoteableKeyMidi Id="128" Name="Quantize" />
					<NamedRemoteableKeyMidi Id="129" Name="Value1" />
					<NamedRemoteableKeyMidi Id="130" Name="Time1" />
					<NamedRemoteableKeyMidi Id="131" Name="IsActive1" />
					<NamedRemoteableKeyMidi Id="132" Name="Value2" />
					<NamedRemoteableKeyMidi Id="133" Name="Time2" />
					<NamedRemoteableKeyMidi Id="134" Name="IsActive2" />
					<NamedRemoteableKeyMidi Id="135" Name="Value3" />
					<NamedRemoteableKeyMidi Id="136" Name="Time3" />
					<NamedRemoteableKeyMidi Id="137" Name="IsActive3" />
				</NamedKeyMidiRemoteables>
				<Breakpoints>
					<Breakpoint Id="0">
						<Value Value="0.5" />
						<Time Value="0" />
						<Control1X Value="0.5" />
						<Control1Y Value="0.5" />
						<Control2X Value="0.5" />
						<Control2Y Value="0.5" />
						<IsActive Value="true" />
					</Breakpoint>
					<Breakpoint Id="1">
						<Value Value="0.5" />
						<Time Value="0.5" />
						<Control1X Value="0.5" />
						<Control1Y Value="0.5" />
						<Control2X Value="0.5" />
						<Control2Y Value="0.5" />
						<IsActive Value="false" />
					</Breakpoint>
					<Breakpoint Id="2">
						<Value Value="0.5" />
						<Time Value="1" />
						<Control1X Value="0.5" />
						<Control1Y Value="0.5" />
						<Control2X Value="0.5" />
						<Control2Y Value="0.5" />
						<IsActive Value="true" />
					</Breakpoint>
				</Breakpoints>
				<StretchNoteEnd Value="true" />
				<PreserveTimeRange Value="true" />
				<Quantize Value="false" />
			</TimeWarpAlgorithm>
			<RhythmAlgorithm Id="8">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="84" Name="Density" />
					<NamedRemoteableKeyMidi Id="85" Name="Repetitions" />
					<NamedRemoteableKeyMidi Id="86" Name="Pattern" />
					<NamedRemoteableKeyMidi Id="87" Name="Steps" />
					<NamedRemoteableKeyMidi Id="88" Name="Pitch" />
					<NamedRemoteableKeyMidi Id="89" Name="Velocity" />
					<NamedRemoteableKeyMidi Id="90" Name="Accent" />
					<NamedRemoteableKeyMidi Id="91" Name="Period" />
					<NamedRemoteableKeyMidi Id="92" Name="Offset" />
					<NamedRemoteableKeyMidi Id="93" Name="Shift" />
					<NamedRemoteableKeyMidi Id="94" Name="StepDuration" />
					<NamedRemoteableKeyMidi Id="95" Name="Split" />
					<NamedRemoteableKeyMidi Id="96" Name="VelocityOffsetIncrement" />
					<NamedRemoteableKeyMidi Id="97" Name="VelocityOffsetDecrement" />
				</NamedKeyMidiRemoteables>
				<Density Value="4" />
				<Repetitions Value="1" />
				<Pattern Value="14" />
				<PatternLength Value="8" />
				<Pitch Value="36" />
				<Velocity Value="100" />
				<Accent Value="127" />
				<Period Value="4" />
				<Offset Value="0" />
				<Shift Value="0" />
				<StepDuration Value="7" />
				<Split Value="0" />
			</RhythmAlgorithm>
			<StacksAlgorithm Id="9">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="72" Name="AppendChord" />
					<NamedRemoteableKeyMidi Id="73" Name="DeleteSelectedChord" />
					<NamedRemoteableKeyMidi Id="74" Name="RootPitch1" />
					<NamedRemoteableKeyMidi Id="75" Name="Inversion1" />
					<NamedRemoteableKeyMidi Id="76" Name="Rule1" />
					<NamedRemoteableKeyMidi Id="77" Name="Duration1" />
					<NamedRemoteableKeyMidi Id="78" Name="Offset1" />
				</NamedKeyMidiRemoteables>
				<Sequence>
					<Chord Id="8">
						<RootDegree Value="0" />
						<Octave Value="3" />
						<RootPitch Value="60" />
						<Inversion Value="0" />
						<RuleNumber Value="0" />
						<Duration Value="1" />
						<Offset Value="0" />
					</Chord>
				</Sequence>
			</StacksAlgorithm>
			<ShapeAlgorithm Id="10">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="42" Name="ShapePresets" />
					<NamedRemoteableKeyMidi Id="43" Name="Rate" />
					<NamedRemoteableKeyMidi Id="44" Name="Tie" />
					<NamedRemoteableKeyMidi Id="45" Name="Density" />
					<NamedRemoteableKeyMidi Id="46" Name="MinPitch" />
					<NamedRemoteableKeyMidi Id="47" Name="MaxPitch" />
					<NamedRemoteableKeyMidi Id="48" Name="PitchVariation" />
				</NamedKeyMidiRemoteables>
				<ShapeLevels>
					<RemoteableFloat Id="0" Value="0" />
					<RemoteableFloat Id="1" Value="0.05000000075" />
					<RemoteableFloat Id="2" Value="0.1000000015" />
					<RemoteableFloat Id="3" Value="0.150000006" />
					<RemoteableFloat Id="4" Value="0.200000003" />
					<RemoteableFloat Id="5" Value="0.25" />
					<RemoteableFloat Id="6" Value="0.3000000119" />
					<RemoteableFloat Id="7" Value="0.349999994" />
					<RemoteableFloat Id="8" Value="0.400000006" />
					<RemoteableFloat Id="9" Value="0.4499999881" />
					<RemoteableFloat Id="10" Value="0.5" />
					<RemoteableFloat Id="11" Value="0.5500000119" />
					<RemoteableFloat Id="12" Value="0.6000000238" />
					<RemoteableFloat Id="13" Value="0.6499999762" />
					<RemoteableFloat Id="14" Value="0.6999999881" />
					<RemoteableFloat Id="15" Value="0.75" />
					<RemoteableFloat Id="16" Value="0.8000000119" />
					<RemoteableFloat Id="17" Value="0.8500000238" />
					<RemoteableFloat Id="18" Value="0.8999999762" />
					<RemoteableFloat Id="19" Value="0.9499999881" />
					<RemoteableFloat Id="20" Value="1" />
				</ShapeLevels>
				<ShapePresets Value="2" />
				<Rate Value="0" />
				<Tie Value="0" />
				<Density Value="1" />
				<MinPitch Value="60" />
				<MaxPitch Value="84" />
				<PitchVariation Value="0" />
			</ShapeAlgorithm>
			<SeedAlgorithm Id="11">
				<NamedKeyMidiRemoteables>
					<NamedRemoteableKeyMidi Id="48" Name="Density" />
					<NamedRemoteableKeyMidi Id="49" Name="MinPitch" />
					<NamedRemoteableKeyMidi Id="50" Name="MaxPitch" />
					<NamedRemoteableKeyMidi Id="51" Name="MinDuration" />
					<NamedRemoteableKeyMidi Id="52" Name="MaxDuration" />
					<NamedRemoteableKeyMidi Id="53" Name="MinVelocity" />
					<NamedRemoteableKeyMidi Id="54" Name="MaxVelocity" />
					<NamedRemoteableKeyMidi Id="55" Name="VerticalLimit" />
				</NamedKeyMidiRemoteables>
				<NotesDensity Value="0.5" />
				<MinPitch Value="60" />
				<MaxPitch Value="84" />
				<MinDuration Value="-6" />
				<MaxDuration Value="-3" />
				<MinVelocity Value="30" />
				<MaxVelocity Value="100" />
				<VerticalLimit Value="4" />
			</SeedAlgorithm>
			<PitchFilterAlgorithm Id="12">
				<NamedKeyMidiRemoteables />
				<PitchClasses>
					<RemoteableBool Id="2280" Value="false" />
					<RemoteableBool Id="2281" Value="false" />
					<RemoteableBool Id="2282" Value="false" />
					<RemoteableBool Id="2283" Value="false" />
					<RemoteableBool Id="2284" Value="false" />
					<RemoteableBool Id="2285" Value="false" />
					<RemoteableBool Id="2286" Value="false" />
					<RemoteableBool Id="2287" Value="false" />
					<RemoteableBool Id="2288" Value="false" />
					<RemoteableBool Id="2289" Value="false" />
					<RemoteableBool Id="2290" Value="false" />
					<RemoteableBool Id="2291" Value="false" />
				</PitchClasses>
				<DrumPad Value="128" />
				<Invert Value="false" />
			</PitchFilterAlgorithm>
			<TimeFilterAlgorithm Id="13">
				<NamedKeyMidiRemoteables />
				<Start Value="0" />
				<Length Value="0.25" />
				<Repeat Value="0" />
				<Invert Value="false" />
			</TimeFilterAlgorithm>
		</NoteAlgorithms>`;

// ============================================================
// ID allocation
// ============================================================
const TRACK_ID_BASE = 50000;
const DEVICE_ID_BASE = 60000;
const ID_BLOCK = 200;

function fillTrackIds(template: string, ti: number): string {
  let s = template;
  for (let n = 0; n < ID_BLOCK; n++)
    s = s.replaceAll(`__ID${n}__`, String(TRACK_ID_BASE + ti * ID_BLOCK + n));
  return s;
}

function fillDeviceIds(template: string, ti: number): string {
  let s = template;
  for (let n = 0; n < ID_BLOCK; n++)
    s = s.replaceAll(`__DID${n}__`, String(DEVICE_ID_BASE + ti * ID_BLOCK + n));
  return s;
}

// ============================================================
// WAV parsing
// ============================================================
function parseWav(wav: ArrayBuffer): { sampleCount: number; sampleRate: number } {
  const v = new DataView(wav);
  const sampleRate = v.getUint32(24, true);
  const channels = v.getUint16(22, true);
  const bitsPerSample = v.getUint16(34, true);
  const bytesPerSample = bitsPerSample / 8;
  let pos = 36;
  while (pos < wav.byteLength - 8) {
    const id = String.fromCharCode(v.getUint8(pos), v.getUint8(pos+1), v.getUint8(pos+2), v.getUint8(pos+3));
    const sz = v.getUint32(pos + 4, true);
    if (id === 'data') return { sampleCount: sz / (channels * bytesPerSample), sampleRate };
    pos += 8 + sz;
  }
  return { sampleCount: 44100, sampleRate: 44100 };
}

// ============================================================
// Device builder — always OriginalSimpler
// ============================================================
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function ensureWavExt(name: string): string {
  return name.toLowerCase().endsWith('.wav') ? name : `${name}.wav`;
}

function buildDevice(inst: InstrumentData, ti: number): string {
  const filename = ensureWavExt(inst.sample?.filename ?? `instrument_${ti}`);
  const { sampleCount, sampleRate } = parseWav(inst.wav);
  const relPath = `Samples/Recorded/${filename}`;

  // playmode 4 = Slice, 5 = BeatSlice → Simpler Slice mode (2)
  // everything else → Simpler 1-Shot mode (1)
  const isSliceMode = inst.playmode === 4 || inst.playmode === 5;
  const playbackMode = isSliceMode ? '2' : '1';

  // Build slice points (only for slice modes; 0-65535 = 0%-100% of sample length)
  let slicePointsXml = '';
  if (isSliceMode && inst.numSlices > 0) {
    for (let i = 0; i < inst.numSlices; i++) {
      const timeInSeconds = (inst.slices[i] / 65535) * (sampleCount / sampleRate);
      slicePointsXml += `\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<SlicePoint TimeInSeconds="${timeInSeconds.toFixed(16)}" Rank="0" NormalizedEnergy="1" />`;
    }
  }

  return fillDeviceIds(SIMPLER_DEVICE_TPL, ti)
    .replaceAll('__SAMPLE_NAME__', esc(filename.replace(/\.[^.]+$/, '')))
    .replaceAll('__SAMPLE_RELPATH__', relPath)
    .replaceAll('__SAMPLE_ABS_PATH__', '')
    .replaceAll('__SAMPLE_SIZE__', String(inst.wav.byteLength))
    .replaceAll('__SAMPLE_END__', String(Math.round(sampleCount)))
    .replaceAll('__SAMPLE_RATE__', String(sampleRate))
    .replace('__PLAYBACK_MODE__', playbackMode)
    .replace('__SLICE_POINTS__', slicePointsXml);
}

// ============================================================
// Notes / Clip helpers
// ============================================================
function gzipXml(xml: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(xml);
  const stream = new CompressionStream('gzip');
  const writer = stream.writable.getWriter();
  writer.write(data);
  writer.close();
  return new Response(stream.readable).arrayBuffer().then(b => new Uint8Array(b));
}

const T11 = '\t\t\t\t\t\t\t\t\t\t\t';
const T12 = '\t\t\t\t\t\t\t\t\t\t\t\t';
const T13 = '\t\t\t\t\t\t\t\t\t\t\t\t\t';
const T14 = '\t\t\t\t\t\t\t\t\t\t\t\t\t\t';
const T15 = '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t';
const SLOT_TABS = '\t\t\t\t\t\t\t';

function buildNotesBlock(
  notesByPitch: Map<number, { time: number; duration: number; velocity: number; noteId: number }[]>,
): string {
  let totalNotes = 0;
  const keyTracksXml = [...notesByPitch.entries()]
    .sort(([a], [b]) => a - b)
    .map(([pitch, notes]) => {
      // Sort by time — notes come from multiple columns and may be out of order
      const sorted = [...notes].sort((a, b) => a.time - b.time);
      const notesXml = sorted
        .map(n => `${T15}<MidiNoteEvent Time="${n.time.toFixed(6)}" Duration="${n.duration.toFixed(6)}" Velocity="${n.velocity}" OffVelocity="64" NoteId="${n.noteId}" />`)
        .join('\n');
      totalNotes += notes.length;
      return `${T13}<KeyTrack Id="${pitch}">\n${T14}<Notes>\n${notesXml}\n${T14}</Notes>\n${T14}<MidiKey Value="${pitch}" />\n${T13}</KeyTrack>`;
    }).join('\n');

  return `<Notes>\n${T12}<KeyTracks>\n${keyTracksXml}\n${T12}</KeyTracks>\n` +
    `${T12}<PerNoteEventStore>\n${T13}<EventLists />\n${T12}</PerNoteEventStore>\n` +
    `${T12}<NoteProbabilityGroups />\n` +
    `${T12}<ProbabilityGroupIdGenerator>\n${T13}<NextId Value="1" />\n${T12}</ProbabilityGroupIdGenerator>\n` +
    `${T12}<NoteIdGenerator>\n${T13}<NextId Value="${totalNotes + 1}" />\n${T12}</NoteIdGenerator>\n` +
    `${T11}</Notes>`;
}

function buildMidiClip(
  name: string, clipLenBeats: number,
  notesByPitch: Map<number, { time: number; duration: number; velocity: number; noteId: number }[]>,
): string {
  return MIDI_CLIP_TPL
    .replaceAll('__CLIP_NAME__', esc(name))
    .replaceAll('__CLIP_LEN__', clipLenBeats.toFixed(6))
    .replace('__NOTES_BLOCK__', buildNotesBlock(notesByPitch));
}

function emptySlot(id: number): string {
  return `${SLOT_TABS}<ClipSlot Id="${id}">\n${SLOT_TABS}\t<LomId Value="0" />\n` +
    `${SLOT_TABS}\t<ClipSlot>\n${SLOT_TABS}\t\t<Value />\n${SLOT_TABS}\t</ClipSlot>\n` +
    `${SLOT_TABS}\t<HasStop Value="true" />\n${SLOT_TABS}\t<NeedRefreeze Value="true" />\n` +
    `${SLOT_TABS}</ClipSlot>`;
}

function emptyClipSlots(count: number): string {
  return Array.from({ length: count }, (_, i) => emptySlot(i)).join('\n');
}

function buildScene(index: number, name: string): string {
  return `\t\t\t<Scene Id="${index}">\n` +
    `\t\t\t\t<FollowAction>\n\t\t\t\t\t<FollowTime Value="4" />\n\t\t\t\t\t<IsLinked Value="true" />\n` +
    `\t\t\t\t\t<LoopIterations Value="1" />\n\t\t\t\t\t<FollowActionA Value="4" />\n` +
    `\t\t\t\t\t<FollowActionB Value="0" />\n\t\t\t\t\t<FollowChanceA Value="100" />\n` +
    `\t\t\t\t\t<FollowChanceB Value="0" />\n\t\t\t\t\t<JumpIndexA Value="${index}" />\n` +
    `\t\t\t\t\t<JumpIndexB Value="${index}" />\n\t\t\t\t\t<FollowActionEnabled Value="false" />\n` +
    `\t\t\t\t</FollowAction>\n\t\t\t\t<Name Value="${esc(name)}" />\n\t\t\t\t<Annotation Value="" />\n` +
    `\t\t\t\t<Color Value="-1" />\n\t\t\t\t<Tempo Value="-1" />\n\t\t\t\t<IsTempoEnabled Value="false" />\n` +
    `\t\t\t\t<TimeSignatureId Value="201" />\n\t\t\t\t<IsTimeSignatureEnabled Value="false" />\n` +
    `\t\t\t\t<LomId Value="0" />\n\t\t\t\t<ClipSlotsListWrapper LomId="0" />\n\t\t\t</Scene>`;
}

// ============================================================
// Main generator
// ============================================================
function generateAbletonXml(
  instruments: (InstrumentData | null)[],
  patterns: { name: string; data: PatternData }[],
  bpm: number,
): string {
  const usedInstruments = new Set<number>();
  for (const p of patterns)
    for (const track of p.data.tracks) {
      const len = track.length + 1;
      for (let s = 0; s < len; s++) {
        const step = track.steps[s];
        if (step && step.note >= 0 && step.note <= 127 && step.instrument >= 0)
          usedInstruments.add(step.instrument);
      }
    }

  const usedSlots = [...usedInstruments].sort((a, b) => a - b);
  const midiTracksXml: string[] = [];

  for (let ti = 0; ti < usedSlots.length; ti++) {
    const slot = usedSlots[ti];
    const inst = instruments[slot];
    const instName = inst?.sample?.filename?.replace(/\.[^.]+$/, '') ?? `Instrument ${slot + 1}`;

    const mainSlots: string[] = [];
    const freezeSlots: string[] = [];

    for (const p of patterns) {
      const slotId = mainSlots.length;
      // Use max step count across all columns
      const numSteps = p.data.tracks.length > 0
        ? Math.max(...p.data.tracks.map(t => t.length + 1))
        : 16;
      const clipLenBeats = numSteps * 0.25;
      const notesByPitch = new Map<number, { time: number; duration: number; velocity: number; noteId: number }[]>();
      let noteIdInClip = 1;

      // Collect notes for this slot across ALL columns in this pattern
      for (const track of p.data.tracks) {
        const len = track.length + 1;
        for (let s = 0; s < len; s++) {
          const step = track.steps[s];
          if (!step || step.note < 0 || step.note > 127 || step.instrument !== slot) continue;
          if (!notesByPitch.has(step.note)) notesByPitch.set(step.note, []);
          notesByPitch.get(step.note)!.push({ time: s * 0.25, duration: 0.23, velocity: 100, noteId: noteIdInClip++ });
        }
      }

      if (notesByPitch.size === 0) {
        mainSlots.push(emptySlot(slotId));
      } else {
        const clipXml = buildMidiClip(p.name, clipLenBeats, notesByPitch);
        mainSlots.push(
          `${SLOT_TABS}<ClipSlot Id="${slotId}">\n${SLOT_TABS}\t<LomId Value="0" />\n` +
          `${SLOT_TABS}\t<ClipSlot>\n${SLOT_TABS}\t\t<Value>\n` +
          clipXml + '\n' +
          `${SLOT_TABS}\t\t</Value>\n${SLOT_TABS}\t</ClipSlot>\n` +
          `${SLOT_TABS}\t<HasStop Value="true" />\n${SLOT_TABS}\t<NeedRefreeze Value="true" />\n` +
          `${SLOT_TABS}</ClipSlot>`
        );
      }
      freezeSlots.push(emptySlot(slotId));
    }

    const deviceXml = inst?.wav ? buildDevice(inst, ti) : '';

    let trackXml = fillTrackIds(MIDI_TRACK_TPL, ti)
      .replaceAll('__TRACK_ID__', String(1000 + ti))
      .replaceAll('__TRACK_NAME__', esc(instName))
      .replace('__CLIP_SLOT_LIST_MAIN__', mainSlots.join('\n'))
      .replace('__CLIP_SLOT_LIST_FREEZE__', freezeSlots.join('\n'))
      .replace('__DEVICE__', deviceXml);

    midiTracksXml.push(trackXml);
  }

  const scenesXml = patterns.map((p, i) => buildScene(i, p.name)).join('\n');
  const mainTrackXml = MAIN_TRACK_TPL
    .replaceAll('__BPM__', String(bpm))
    .replace('__MAIN_TRACK_SLOTS__', emptyClipSlots(patterns.length));

  const nextPointeeId = DEVICE_ID_BASE + (usedSlots.length + 2) * ID_BLOCK;

  return `<?xml version="1.0" encoding="UTF-8"?>
<Ableton MajorVersion="5" MinorVersion="${MINOR_VERSION}" SchemaChangeCount="1" Creator="Ableton Live 12.3" Revision="">
\t<LiveSet>
\t\t<NextPointeeId Value="${nextPointeeId}" />
\t\t<OverwriteProtectionNumber Value="0" />
\t\t<LomId Value="0" />
\t\t<LomIdView Value="0" />
\t\t<Tracks>
${midiTracksXml.join('\n')}
${RETURN_TRACKS_TPL}
\t\t</Tracks>
${mainTrackXml}
${PREHEAR_TPL}
\t\t<SendsPre>
\t\t\t<SendPreBool Id="0" Value="false" />
\t\t\t<SendPreBool Id="1" Value="false" />
\t\t</SendsPre>
\t\t<Scenes>
${scenesXml}
\t\t</Scenes>
${LIVESET_TAIL}
\t</LiveSet>
</Ableton>`;
}

// ============================================================
// Public export
// ============================================================
export async function exportAbletonProject(
  instruments: (InstrumentData | null)[],
  patterns: { name: string; data: PatternData }[],
  bpm: number,
  projectName: string,
): Promise<Blob> {
  const zip = new JSZip();
  const projectFolder = zip.folder(projectName)!;

  const xml = generateAbletonXml(instruments, patterns, bpm);
  const gzipped = await gzipXml(xml);
  projectFolder.file('Project.als', gzipped);

  const samplesFolder = projectFolder.folder('Samples')!.folder('Recorded')!;
  for (const inst of instruments) {
    if (!inst?.wav || !inst.sample?.filename) continue;
    samplesFolder.file(ensureWavExt(inst.sample.filename), inst.wav);
  }

  return zip.generateAsync({ type: 'blob' });
}
